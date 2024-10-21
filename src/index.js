"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWallet = exports.coins = void 0;
exports.coins = ['btc', 'eth', 'xmr'];
const walletOptions_1 = require("./walletOptions");
// import store from './store';
function setupWallet(options) {
    walletOptions_1.walletOptionsStore.setOptions(options);
    console.log('setupWallet');
    //   const { getState, setState, subscribe, getInitialState } = store;
    //   return store;
}
exports.setupWallet = setupWallet;
