import { type WalletOptions } from './types.js';
export const coins = ['btc', 'eth', 'xmr'];

import { walletOptionsStore } from './walletOptions/index.js';
// import store from './store';

export function setupWallet(options: WalletOptions) {
  walletOptionsStore.setOptions(options);
  console.log('setupWallet');
  //   const { getState, setState, subscribe, getInitialState } = store;
  //   return store;
}
