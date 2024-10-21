"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testnetNativeAssets = exports.nativeAssets = void 0;
const testnet_1 = require("./testnet");
const types_1 = require("./types");
const sendGasLimits_1 = require("./sendGasLimits");
const nativeAssets = {
    BTC: {
        name: 'Bitcoin',
        chain: types_1.ChainId.Bitcoin,
        type: types_1.AssetTypes.native,
        code: 'BTC',
        coinGeckoId: 'bitcoin',
        color: '#f7931a',
        decimals: 8,
        sendGasLimit: sendGasLimits_1.sendGasLimits.BTC,
    },
    ETH: {
        name: 'Ether',
        chain: types_1.ChainId.Ethereum,
        type: types_1.AssetTypes.native,
        code: 'ETH',
        coinGeckoId: 'ethereum',
        color: '#627eea',
        decimals: 18,
        sendGasLimit: sendGasLimits_1.sendGasLimits.NATIVE_EVM,
    },
    SOL: {
        name: 'Solana',
        chain: types_1.ChainId.Solana,
        type: types_1.AssetTypes.native,
        code: 'SOL',
        coinGeckoId: 'solana',
        color: '#008080',
        decimals: 9,
        sendGasLimit: sendGasLimits_1.sendGasLimits.SOL,
    },
    BNB: {
        name: 'Binance Coin',
        chain: types_1.ChainId.BinanceSmartChain,
        type: types_1.AssetTypes.native,
        code: 'BNB',
        coinGeckoId: 'binancecoin',
        color: '#f3ba2f',
        decimals: 18,
        sendGasLimit: sendGasLimits_1.sendGasLimits.NATIVE_EVM,
    },
    MATIC: {
        name: 'Polygon',
        chain: types_1.ChainId.Polygon,
        type: types_1.AssetTypes.native,
        code: 'MATIC',
        coinGeckoId: 'matic-network',
        color: '#8247e5',
        decimals: 18,
        sendGasLimit: sendGasLimits_1.sendGasLimits.NATIVE_EVM,
    },
};
exports.nativeAssets = nativeAssets;
const testnetNativeAssets = testnet_1.TESTNET_NATIVE.reduce((assets, asset) => {
    return Object.assign(assets, {
        [asset]: {
            ...nativeAssets[asset],
        },
    });
}, {});
exports.testnetNativeAssets = testnetNativeAssets;
