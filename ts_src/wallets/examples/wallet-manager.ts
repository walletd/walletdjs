import { CoinTypes, WalletManager } from "../";

(async () => {
    let walletManager = new WalletManager();
    const hdWallet = walletManager.createHDWallet();
    // btc
    let btcWallet = hdWallet.createWallet(CoinTypes.testnet);
    const address = await btcWallet.getAddresses(0, 1);
    console.log(address.toString());
    console.log(await btcWallet.provider.getBlockHeight());
    // eth
    let ethWallet = hdWallet.createWallet(CoinTypes.ethereum);
    console.log((await ethWallet.getAddress()).toString());
    console.log(await ethWallet.provider.getBlockHeight());
})();
