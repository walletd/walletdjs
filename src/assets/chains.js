"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTokens = exports.isEthereumChain = exports.chains = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const bitcoin_address_validation_1 = require("bitcoin-address-validation");
const types_1 = require("./types");
const common_1 = require("./common");
const chains = {
    [types_1.ChainId.Bitcoin]: {
        name: 'Bitcoin',
        code: 'BTC',
        nativeAsset: 'BTC',
        fees: {
            unit: 'sat/b',
        },
        safeConfirmations: 1,
        // 0,1 blocks per minute * 180 minutes (3 hours) -> 18 blocks wait period
        txFailureTimeout: 10800000, // 3 hours in ms
        evmCompatible: false,
        hasTokens: false,
        supportCustomFees: true,
        // TODO: include network types in validation
        isValidAddress: (address) => !!(0, bitcoin_address_validation_1.default)(address),
        formatAddress: (address) => address,
        isValidTransactionHash: (hash) => (0, common_1.isValidHexWithout0xPrefix)(hash),
        formatTransactionHash: (hash) => (0, common_1.toLowerCaseWithout0x)(hash),
    },
    [types_1.ChainId.Ethereum]: {
        name: 'Ethereum',
        code: 'ETH',
        nativeAsset: 'ETH',
        fees: {
            unit: 'gwei',
        },
        safeConfirmations: 3,
        // ~4 blocks per minute * 30 minutes -> 120 blocks wait period
        txFailureTimeout: 1800000, // in ms
        evmCompatible: true,
        hasTokens: true,
        supportCustomFees: true,
        isValidAddress: (hexAddress) => (0, ethereumjs_util_1.isValidAddress)((0, common_1.with0x)(hexAddress)),
        formatAddress: (hexAddress) => (0, ethereumjs_util_1.toChecksumAddress)((0, common_1.with0x)(hexAddress)),
        isValidTransactionHash: (hash) => (0, common_1.isValidHexWith0xPrefix)(hash),
        formatTransactionHash: (hash) => (0, common_1.toLowerCaseWithout0x)(hash),
    },
    [types_1.ChainId.Solana]: {
        name: 'Solana',
        code: 'SOL',
        nativeAsset: 'SOL',
        fees: {
            unit: 'Lamports',
        },
        safeConfirmations: 10,
        // ~120 blocks per minute * 5 minutes -> 600 blocks wait period
        txFailureTimeout: 300000, // in ms
        evmCompatible: false,
        hasTokens: false,
        supportCustomFees: false,
        isValidAddress: (address) => (0, common_1.isValidSolanaAddress)(address),
        formatAddress: (address) => address,
        isValidTransactionHash: (hash) => (0, common_1.isValidSolanaTx)(hash),
        formatTransactionHash: (hash) => hash,
    },
    [types_1.ChainId.BinanceSmartChain]: {
        name: 'Binance Smart Chain',
        code: 'BNB',
        nativeAsset: 'BNB',
        fees: {
            unit: 'gwei',
        },
        safeConfirmations: 3,
        // ~4 blocks per minute * 30 minutes -> 120 blocks wait period
        txFailureTimeout: 1800000, // in ms
        evmCompatible: true,
        hasTokens: true,
        supportCustomFees: true,
        isValidAddress: (hexAddress) => (0, ethereumjs_util_1.isValidAddress)((0, common_1.with0x)(hexAddress)),
        formatAddress: (hexAddress) => (0, ethereumjs_util_1.toChecksumAddress)((0, common_1.with0x)(hexAddress)),
        isValidTransactionHash: (hash) => (0, common_1.isValidHexWith0xPrefix)(hash),
        formatTransactionHash: (hash) => (0, common_1.toLowerCaseWithout0x)(hash),
    },
    [types_1.ChainId.Polygon]: {
        name: 'Polygon',
        code: 'MATIC',
        nativeAsset: 'MATIC',
        fees: {
            unit: 'gwei',
        },
        safeConfirmations: 3,
        // ~4 blocks per minute * 30 minutes -> 120 blocks wait period
        txFailureTimeout: 1800000, // in ms
        evmCompatible: true,
        hasTokens: true,
        supportCustomFees: true,
        isValidAddress: (hexAddress) => (0, ethereumjs_util_1.isValidAddress)((0, common_1.with0x)(hexAddress)),
        formatAddress: (hexAddress) => (0, ethereumjs_util_1.toChecksumAddress)((0, common_1.with0x)(hexAddress)),
        isValidTransactionHash: (hash) => (0, common_1.isValidHexWith0xPrefix)(hash),
        formatTransactionHash: (hash) => (0, common_1.toLowerCaseWithout0x)(hash),
    },
};
exports.chains = chains;
function isEthereumChain(chain) {
    return chains[chain].evmCompatible;
}
exports.isEthereumChain = isEthereumChain;
function hasTokens(chain) {
    return chains[chain].hasTokens;
}
exports.hasTokens = hasTokens;
