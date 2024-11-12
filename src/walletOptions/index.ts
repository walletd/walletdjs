import { type WalletOptions } from '../types.js';

class WalletOptionsStore {
  walletOptions: WalletOptions | undefined;
  setOptions(options: WalletOptions) {
    this.walletOptions = options;
  }
}

const walletOptionsStore = new WalletOptionsStore();

export { walletOptionsStore };
