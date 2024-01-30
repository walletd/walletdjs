import { CoinTypes, WalletManager } from "../";

(async () => {
    let walletManager = new WalletManager();
    const wallet = walletManager.createHDWallet();
    let btcWallet = wallet.createWallet(CoinTypes.testnet);
    let address = btcWallet.address()
    console.log(address);
})();