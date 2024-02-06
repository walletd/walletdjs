"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumWallet = void 0;
const evm_1 = require("@chainify/evm");
const types_1 = require("@chainify/types");
const ethAsset = {
    name: "Ethereum",
    code: "ETH",
    chain: types_1.ChainId.Ethereum,
    type: types_1.AssetTypes.native,
    decimals: 18,
};
class EthereumWallet {
    constructor(options, ethProvider) {
        this.wallet = new evm_1.EvmWalletProvider(options, ethProvider);
        this.provider = ethProvider;
    }
    async getAddress() {
        return await this.wallet.getAddress();
    }
    async getBalance() {
        return await this.wallet.getBalance([ethAsset]);
    }
    async sendTransaction(to, value) {
        const transaction = { asset: ethAsset, to: to, value: (0, types_1.BigNumber)(value) };
        return await this.wallet.sendTransaction(transaction);
    }
    async estimateGas(to, value) {
        const tx = {
            to,
            value
        };
        return await this.wallet.estimateGas(tx);
    }
    async signMessage(message) {
        return await this.wallet.signMessage(message, await this.wallet.getAddress());
    }
}
exports.EthereumWallet = EthereumWallet;
