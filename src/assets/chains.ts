import { isValidAddress, toChecksumAddress } from 'ethereumjs-util';
import { validate } from 'bitcoin-address-validation';

import { type Chain, ChainId } from './types.js';
import {
  isValidSolanaAddress,
  isValidHexWithout0xPrefix,
  isValidSolanaTx,
  toLowerCaseWithout0x,
  with0x,
  isValidHexWith0xPrefix,
} from './common.js';

const chains: { [key in ChainId]: Chain } = {
  [ChainId.Bitcoin]: {
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
    isValidAddress: (address: string) => !!validate(address),
    formatAddress: (address: string) => address,
    isValidTransactionHash: (hash: string) => isValidHexWithout0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Ethereum]: {
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
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) =>
      toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Solana]: {
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
    isValidAddress: (address: string) => isValidSolanaAddress(address),
    formatAddress: (address: string) => address,
    isValidTransactionHash: (hash: string) => isValidSolanaTx(hash),
    formatTransactionHash: (hash: string) => hash,
  },
  [ChainId.BinanceSmartChain]: {
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
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) =>
      toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
  [ChainId.Polygon]: {
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
    isValidAddress: (hexAddress: string) => isValidAddress(with0x(hexAddress)),
    formatAddress: (hexAddress: string) =>
      toChecksumAddress(with0x(hexAddress)),
    isValidTransactionHash: (hash: string) => isValidHexWith0xPrefix(hash),
    formatTransactionHash: (hash: string) => toLowerCaseWithout0x(hash),
  },
};

function isEthereumChain(chain: ChainId) {
  return chains[chain].evmCompatible;
}

function hasTokens(chain: ChainId) {
  return chains[chain].hasTokens;
}

export { chains, isEthereumChain, hasTokens };
