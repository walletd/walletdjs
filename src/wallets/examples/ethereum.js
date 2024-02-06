"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
(async () => {
    let walletManager = new __1.WalletManager();
    const hdWallet = walletManager.importHDWallet("black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit");
    let ethWallet = hdWallet.createWallet(__1.CoinTypes.ethereum);
    let btcWallet = hdWallet.createWallet(__1.CoinTypes.testnet);
    console.log(ethWallet.address(), btcWallet.address());
})();
