"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinNetworks = void 0;
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const bitcoin = {
    name: 'bitcoin',
    ...bitcoinjs_lib_1.networks.bitcoin,
    coinType: '0',
    isTestnet: false,
};
const bitcoin_testnet = {
    name: 'bitcoin_testnet',
    ...bitcoinjs_lib_1.networks.testnet,
    coinType: '1',
    isTestnet: true,
};
const bitcoin_regtest = {
    name: 'bitcoin_regtest',
    ...bitcoinjs_lib_1.networks.regtest,
    coinType: '1',
    isTestnet: true,
};
const BitcoinNetworks = {
    bitcoin,
    bitcoin_testnet,
    bitcoin_regtest,
};
exports.BitcoinNetworks = BitcoinNetworks;
