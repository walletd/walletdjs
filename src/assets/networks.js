"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtcProviderOptions = exports.EvmProviderOptions = void 0;
const bitcoin_1 = require("@chainify/bitcoin");
exports.EvmProviderOptions = {
    ganache: {
        name: 'sepolia',
        coinType: 'native',
        isTestnet: true,
        chainId: 11155111,
        rpcUrl: 'https://1rpc.io/sepolia',
    },
    bnbTestnet: {
        name: 'bnbTestnet',
        coinType: 'native',
        isTestnet: true,
        chainId: 97,
        rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
    },
    bnb: {
        name: 'bnb',
        coinType: 'native',
        isTestnet: false,
        chainId: 56,
        rpcUrl: 'https://binance.llamarpc.com',
    },
    polygonTestnet: {
        name: 'polygonTestnet',
        coinType: 'native',
        isTestnet: true,
        chainId: 80001,
        rpcUrl: 'https://polygon-mumbai-bor-rpc.publicnode.com',
    },
};
exports.BtcProviderOptions = {
    regtestBatch: {
        url: 'http://localhost:3002',
        batchUrl: 'http://localhost:5003',
        network: bitcoin_1.BitcoinNetworks.bitcoin_regtest,
    },
};
