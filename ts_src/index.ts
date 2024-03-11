import { Providers } from './bitcoin/providers';
import { WalletOptions } from './types';
export const coins = ['btc', 'eth', 'xmr'];

export { Providers };

import { walletOptionsStore } from './walletOptions';
import store from './store';

export function setupWallet(options: WalletOptions) {
  walletOptionsStore.setOptions(options);
  console.log('setupWallet');
  //   const { getState, setState, subscribe, getInitialState } = store;
  return store;
}
