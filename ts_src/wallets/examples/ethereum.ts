import { CoinTypes, WalletManager } from "../";

(async () => {
  let walletManager = new WalletManager();
  const hdWallet = walletManager.importHDWallet(
    "black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit",
  );
  let ethWallet = hdWallet.createWallet(CoinTypes.ethereum);
  let btcWallet = hdWallet.createWallet(CoinTypes.testnet);
  console.log(ethWallet.address(), btcWallet.address());
})();
