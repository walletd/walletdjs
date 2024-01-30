import { WalletManager } from "../";

(async () => {
    let walletManager = new WalletManager();
    const wallet = walletManager.createHDWallet();
    let btcWallet = wallet.testnetWallet();
    let address = btcWallet.generateAddress()
    console.log(address.address);
})();