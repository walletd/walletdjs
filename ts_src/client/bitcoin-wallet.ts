import { BitcoinHDWalletProviderOptions } from '@chainify/bitcoin/dist/lib/types';
import { BitcoinEsploraBaseProvider, BitcoinHDWalletProvider } from '@chainify/bitcoin'
import { Address } from '@chainify/types';
import * as EsploraTypes from '@chainify/bitcoin/dist/lib/chain/esplora/types';
import { asyncWrite, asyncRead, exists, UTXO } from './';
import { Transaction as EsploraTransaction } from '@chainify/bitcoin/dist/lib/chain/esplora/types';
import { Transaction } from '@chainify/types';
import { BitcoinEsploraApiProvider } from '../bitcoin';

async function sleep(ms: number) { 
    new Promise(resolve => setTimeout(resolve, ms))
}

export class BitcoinWallet {
    constructor (options: BitcoinHDWalletProviderOptions, provider: BitcoinEsploraApiProvider) {
        this.wallet = new BitcoinHDWalletProvider(options, provider)
        this.provider = provider
    }
    wallet: BitcoinHDWalletProvider
    provider: BitcoinEsploraApiProvider
    usedAddresses: Address[] = []
    utxos: UTXO[] = []

    async getAddresses (start: number, end: number) {
        return await this.wallet.getAddresses(start, end)
    }
    async getUsedAddresses () {
        return await this.wallet.getUsedAddresses(1)
    }
    // async getBalance (addresses: string[]) {
    //     return await this.wallet.getBalance(addresses)
    // }
    async getTransactionList (hashes: string[]) {
        let transactions = Array()
        for (let i = 0; i < hashes.length; i++) {
            const result = await this.provider.getTransactionByHash(hashes[0])
            transactions = transactions.concat(result)
            await sleep(5000)
        }
        return transactions
    }
    async getUnspentTransactions (addresses: string[]) {
        return await this.provider.getUnspentTransactions(addresses)
    }
    // async getBlockHeight () {
    //     return await this.provider.getBlockHeight()
    // }
    async signMessage (message: string) {
        return await this.wallet.signMessage(message, (await this.wallet.getAddresses(0,1))[0].address)
    }

    async _usedAddresses (): Promise<Address[]> {
        if (exists("addresses.json")) {
            // console.log("addresses file exists")
            this.usedAddresses = await asyncRead<Address[]>("addresses.json")
        } else {
            // console.log("addresses file does not exist")
            this.usedAddresses = await this.getUsedAddresses()
            asyncWrite<Address[]>('addresses.json', this.usedAddresses);
        }
        return this.usedAddresses
    }

    async _utxos (): Promise<UTXO[]> {
        if (exists("utxos.json")) {
            // console.log("utxo file exists")
            this.utxos = await asyncRead<UTXO[]>("utxos.json")
        } else {
            // console.log("utxo file does not exist")
            for (let i = 0; i < this.usedAddresses.length; i++) {
                const result: UTXO[] = await this.getUnspentTransactions([this.usedAddresses[i].address]) as unknown as UTXO[]
                this.utxos = this.utxos.concat(result)
                await sleep(5000)
            }
            // usedAddresses = await bitcoin.getUsedAddresses()
            asyncWrite<UTXO[]>('utxos.json', this.utxos);
        }

        this.utxos.sort((a: UTXO, b: UTXO): number => {
            if (b.status.block_height === undefined) {
                return -1
            }
            if (a.status.block_height === undefined) {
                return 1
            }
        
            if (a.status.block_height < b.status.block_height) {
                return -1
            }
            return 1
        }) 

        return this.utxos
    }

    _forDisplay () {
        let transactions: UTXO[] = this.utxos
        let transactionDisplay = []
        for (let i = 0; i < transactions.length; i++) {
            let date: null|Date = null
            if (transactions[i].status.block_time !== undefined) {
                const temp = transactions[i].status.block_time ?? 1
                date = new Date(temp * 1000)
            }
            transactionDisplay.push({
                txid: transactions[i].txid,
                value: transactions[i].value,
                address: transactions[i].address,
                // status: normalizedTransactions[i].status
                date: date
            })
        }

        return transactionDisplay
    }

    /**
     * Not really sure if we will need this type of function, Im just going to leave it here for now
     * @returns Promise<UTXO[]>
     */
    async _rawTransactions (): Promise<UTXO[]> {
        let rawTransactions = Array()
        if (exists("transactions.json")) {
            rawTransactions = await asyncRead<UTXO[]>("transactions.json")
        } else {
            rawTransactions = await this.getTransactionList(this.utxos.map(t => t.txid))
            asyncWrite<UTXO[]>('transactions.json', rawTransactions);
        }

        return rawTransactions
    }

    async _normalizedTransactions (height: number, BlockstreamEsploraTestnet: EsploraTypes.EsploraApiProviderOptions): Promise<Transaction[]> {
        const EsploraProvider = new BitcoinEsploraBaseProvider(BlockstreamEsploraTestnet)

        let normalizedTransactions = Array()
        if (exists("normalized-transactions.json")) {
            normalizedTransactions = await asyncRead<Transaction[]>("normalized-transactions.json")
        } else {
            for (let i = 0; i < this.utxos.length; i++) {
                const decodedTx = await EsploraProvider.formatTransaction(this.utxos[i] as unknown as EsploraTransaction, height)
                normalizedTransactions = normalizedTransactions.concat(decodedTx)
                await sleep(5000)
            }
            asyncWrite<Transaction[]>('normalized-transactions.json', normalizedTransactions);
        }

        return normalizedTransactions
    }
}