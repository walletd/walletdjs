"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
(async () => {
    let walletManager = new __1.WalletManager();
    const wallet = walletManager.createHDWallet();
    let btcWallet = wallet.createWallet(__1.CoinTypes.testnet);
    let address = btcWallet.address();
    console.log(address);
})();
