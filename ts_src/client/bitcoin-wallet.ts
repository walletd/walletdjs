import { BitcoinHDWalletProviderOptions } from "@chainify/bitcoin/dist/lib/types";
import {
  BitcoinEsploraBaseProvider,
  BitcoinHDWalletProvider,
} from "@chainify/bitcoin";
import * as EsploraTypes from "@chainify/bitcoin/dist/lib/chain/esplora/types";
import { UTXO } from "./";
import { FileStorage } from "../storage";
import { Transaction as EsploraTransaction } from "@chainify/bitcoin/dist/lib/chain/esplora/types";
import { Address, Transaction } from "@chainify/types";
import { BitcoinEsploraApiProvider } from "../bitcoin";
import { BaseWallet } from "../wallets";

const store = new FileStorage();

async function sleep(ms: number) {
  new Promise((resolve) => setTimeout(resolve, ms));
}

export class BitcoinWallet implements BaseWallet {
  constructor(
    options: BitcoinHDWalletProviderOptions,
    provider: BitcoinEsploraApiProvider,
  ) {
    this.wallet = new BitcoinHDWalletProvider(options, provider);
    this.provider = provider;
  }
  wallet: BitcoinHDWalletProvider;
  provider: BitcoinEsploraApiProvider;
  usedAddresses: Address[] = [];
utxos: UTXO[] = [];

getAddress(): Promise<Address> {
    return this.wallet.getAddresses(0,1).then((addresses) => {
            return new Promise((resolve) => {
                    resolve(addresses[0]);
            })
    })
}
getAddresses(start: number, end: number): Promise<Address[]> {
    return this.wallet.getAddresses(start, end);
}
  
  async getUsedAddresses() {
    return await this.wallet.getUsedAddresses(1);
  }
  // async getBalance (addresses: string[]) {
  //     return await this.wallet.getBalance(addresses)
  // }
  async getTransactionList(hashes: string[]) {
    let transactions = Array();
    for (let i = 0; i < hashes.length; i++) {
      const result = await this.provider.getTransactionByHash(hashes[0]);
      transactions = transactions.concat(result);
      await sleep(5000);
    }
    return transactions;
  }
  async getUnspentTransactions(addresses: string[]) {
    return await this.provider.getUnspentTransactions(addresses);
  }
  // async getBlockHeight () {
  //     return await this.provider.getBlockHeight()
  // }
  async signMessage(message: string) {
    return await this.wallet.signMessage(
      message,
      (await this.wallet.getAddresses(0, 1))[0].address,
    );
  }

  async _usedAddresses(): Promise<Address[]> {
    if (store.exists("addresses.json")) {
      // console.log("addresses file exists")
      this.usedAddresses = await store.asyncRead<Address[]>("addresses.json");
    } else {
      // console.log("addresses file does not exist")
      this.usedAddresses = await this.getUsedAddresses();
      store.asyncWrite<Address[]>("addresses.json", this.usedAddresses);
    }
    return this.usedAddresses;
  }

  async _utxos(): Promise<UTXO[]> {
    if (store.exists("utxos.json")) {
      // console.log("utxo file exists")
      this.utxos = await store.asyncRead<UTXO[]>("utxos.json");
    } else {
      // console.log("utxo file does not exist")
      for (let i = 0; i < this.usedAddresses.length; i++) {
        const result: UTXO[] = (await this.getUnspentTransactions([
          this.usedAddresses[i].address,
        ])) as unknown as UTXO[];
        this.utxos = this.utxos.concat(result);
        await sleep(5000);
      }
      // usedAddresses = await bitcoin.getUsedAddresses()
      store.asyncWrite<UTXO[]>("utxos.json", this.utxos);
    }

    this.utxos.sort((a: UTXO, b: UTXO): number => {
      if (b.status.block_height === undefined) {
        return -1;
      }
      if (a.status.block_height === undefined) {
        return 1;
      }

      if (a.status.block_height < b.status.block_height) {
        return -1;
      }
      return 1;
    });

    return this.utxos;
  }

  _forDisplay() {
    let transactions: UTXO[] = this.utxos;
    let transactionDisplay = [];
    for (let i = 0; i < transactions.length; i++) {
      let date: null | Date = null;
      if (transactions[i].status.block_time !== undefined) {
        const temp = transactions[i].status.block_time ?? 1;
        date = new Date(temp * 1000);
      }
      transactionDisplay.push({
        txid: transactions[i].txid,
        value: transactions[i].value,
        address: transactions[i].address,
        // status: normalizedTransactions[i].status
        date: date,
      });
    }

    return transactionDisplay;
  }

  /**
   * Not really sure if we will need this type of function, Im just going to leave it here for now
   * @returns Promise<UTXO[]>
   */
  async _rawTransactions(): Promise<UTXO[]> {
    let rawTransactions = Array();
    if (store.exists("transactions.json")) {
      rawTransactions = await store.asyncRead<UTXO[]>("transactions.json");
    } else {
      rawTransactions = await this.getTransactionList(
        this.utxos.map((t) => t.txid),
      );
      store.asyncWrite<UTXO[]>("transactions.json", rawTransactions);
    }

    return rawTransactions;
  }

  async _normalizedTransactions(
    height: number,
    BlockstreamEsploraTestnet: EsploraTypes.EsploraApiProviderOptions,
  ): Promise<Transaction[]> {
    const EsploraProvider = new BitcoinEsploraBaseProvider(
      BlockstreamEsploraTestnet,
    );

    let normalizedTransactions = Array();
    if (store.exists("normalized-transactions.json")) {
      normalizedTransactions = await store.asyncRead<Transaction[]>(
        "normalized-transactions.json",
      );
    } else {
      for (let i = 0; i < this.utxos.length; i++) {
        const decodedTx = await EsploraProvider.formatTransaction(
          this.utxos[i] as unknown as EsploraTransaction,
          height,
        );
        normalizedTransactions = normalizedTransactions.concat(decodedTx);
        await sleep(5000);
      }
      store.asyncWrite<Transaction[]>(
        "normalized-transactions.json",
        normalizedTransactions,
      );
    }

    return normalizedTransactions;
  }
}
