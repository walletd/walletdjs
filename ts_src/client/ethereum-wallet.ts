import { TransactionRequest as EthersTxRequest } from '@ethersproject/providers';
import { EvmChainProvider, EvmWalletProvider } from '@chainify/evm'
import { AssetTypes, BigNumber, ChainId, TransactionRequest, WalletOptions } from '@chainify/types'

const ethAsset = {
    name: "Ethereum",
    code: "ETH",
    chain: ChainId.Ethereum,
    type: AssetTypes.native,
    decimals: 18,
}

export class EthereumWallet {
    constructor (options: WalletOptions, ethProvider: EvmChainProvider) {
        this.wallet = new EvmWalletProvider(options, ethProvider)
        this.provider = ethProvider
    }
    wallet: EvmWalletProvider
    provider: EvmChainProvider

    async getAddress () {
        return await this.wallet.getAddress()
    }
    async getBalance () {
        return await this.wallet.getBalance([ ethAsset])
    }
    async sendTransaction (to: string, value: number) {
        const transaction: TransactionRequest = { asset: ethAsset, to: to, value: BigNumber(value)}
        return await this.wallet.sendTransaction(transaction)
    }
    async estimateGas (to: string, value: number) {
        const tx: EthersTxRequest = {
            to,
            value
        }
        return await this.wallet.estimateGas(tx)
    }
    async signMessage (message: string) {
        return await this.wallet.signMessage(message, await this.wallet.getAddress())
    }
}