"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletManager = void 0;
const _1 = require(".");
class WalletManager {
  constructor() {
    this.wallets = Array();
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
}
exports.WalletManager = WalletManager;
