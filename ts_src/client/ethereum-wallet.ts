import { TransactionRequest as EthersTxRequest } from "@ethersproject/providers";
import { EvmChainProvider, EvmWalletProvider } from "./";
import {
    Address,
  AssetTypes,
  BigNumber,
  ChainId,
  TransactionRequest,
  WalletOptions,
} from "@chainify/types";
import { BaseWallet } from "../wallets";

const ethAsset = {
  name: "Ethereum",
  code: "ETH",
  chain: ChainId.Ethereum,
  type: AssetTypes.native,
  decimals: 18,
};

export class EthereumWallet implements BaseWallet{
  constructor(options: WalletOptions, ethProvider: EvmChainProvider) {
    this.wallet = new EvmWalletProvider(options, ethProvider);
    this.provider = ethProvider;
  }
  wallet: EvmWalletProvider;
  provider: EvmChainProvider;

  getAddress() : Promise<Address> {
    return this.wallet.getAddress();
  }
  getAddresses() : Promise<Address[]> {
    return this.wallet.getAddress().then((address) => {
        return new Promise((resolve) => {
                resolve([address]);
        })
    })
  }
  async getBalance() {
    return await this.wallet.getBalance([ethAsset]);
  }
  async sendTransaction(to: string, value: number) {
    const transaction: TransactionRequest = {
      asset: ethAsset,
      to: to,
      value: BigNumber(value),
    };
    return await this.wallet.sendTransaction(transaction);
  }
  async estimateGas(to: string, value: number) {
    const tx: EthersTxRequest = {
      to,
      value,
    };
    return await this.wallet.estimateGas(tx);
  }
  async signMessage(message: string) {
    return await this.wallet.signMessage(
      message,
      await this.wallet.getAddress(),
    );
  }
}
