"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinTypes = exports.WalletManager = exports.HDWallet = void 0;
const hd_wallet_1 = require("./hd-wallet");
Object.defineProperty(exports, "HDWallet", {
  enumerable: true,
  get: function () {
    return hd_wallet_1.HDWallet;
  },
});
Object.defineProperty(exports, "CoinTypes", {
  enumerable: true,
  get: function () {
    return hd_wallet_1.CoinTypes;
  },
});
const wallet_manager_1 = require("./wallet-manager");
Object.defineProperty(exports, "WalletManager", {
  enumerable: true,
  get: function () {
    return wallet_manager_1.WalletManager;
  },
});
