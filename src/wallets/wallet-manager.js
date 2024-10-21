"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletManager = void 0;
const _1 = require(".");
class WalletManager {
    constructor() {
        this.wallets = [];
    }
    createHDWallet() {
        const wallet = _1.HDWallet.generate();
        this.wallets.push(wallet);
        return wallet;
    }
    importHDWallet(mnemonic) {
        const wallet = new _1.HDWallet(mnemonic);
        this.wallets.push(wallet);
        return wallet;
    }
    createWithWalletOptions(walletOptions) {
        const wallet = new _1.HDWallet(walletOptions);
        this.wallets.push(wallet);
        return wallet;
    }
}
exports.WalletManager = WalletManager;
// we have the configuration for the wallets, potentially a single hd wallet or multiple wallets.
// if the coin is present as a key in the walletOptions, then we can create a wallet for that coin.
