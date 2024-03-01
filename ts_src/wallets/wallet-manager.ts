import { HDWallet } from ".";

export class WalletManager {
  wallets: Array<HDWallet>;

  constructor() {
    this.wallets = Array();
  }

  createHDWallet(): HDWallet {
    const wallet = HDWallet.generate();
    this.wallets.push(wallet);
    return wallet;
  }

  importHDWallet(mnemonic: string): HDWallet {
    const wallet = new HDWallet(mnemonic);
    this.wallets.push(wallet);
    return wallet;
  }

  createWithWalletOptions(walletOptions: any): HDWallet {
    const wallet = new HDWallet(walletOptions);
    this.wallets.push(wallet);
    return wallet;
  }
}

// we have the configuration for the wallets, potentially a single hd wallet or multiple wallets.
// if the coin is present as a key in the walletOptions, then we can create a wallet for that coin.
