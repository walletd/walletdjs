import { TESTNET_NATIVE } from './testnet';
import { AssetMap, ChainId, AssetTypes } from './types';
import { sendGasLimits } from './sendGasLimits';

const nativeAssets: AssetMap = {
  BTC: {
    name: 'Bitcoin',
    chain: ChainId.Bitcoin,
    type: AssetTypes.native,
    code: 'BTC',
    coinGeckoId: 'bitcoin',
    color: '#f7931a',
    decimals: 8,
    sendGasLimit: sendGasLimits.BTC,
  },
  ETH: {
    name: 'Ether',
    chain: ChainId.Ethereum,
    type: AssetTypes.native,
    code: 'ETH',
    coinGeckoId: 'ethereum',
    color: '#627eea',
    decimals: 18,
    sendGasLimit: sendGasLimits.NATIVE_EVM,
  },
  SOL: {
    name: 'Solana',
    chain: ChainId.Solana,
    type: AssetTypes.native,
    code: 'SOL',
    coinGeckoId: 'solana',
    color: '#008080',
    decimals: 9,
    sendGasLimit: sendGasLimits.SOL,
  },
  BNB: {
    name: 'Binance Coin',
    chain: ChainId.BinanceSmartChain,
    type: AssetTypes.native,
    code: 'BNB',
    coinGeckoId: 'binancecoin',
    color: '#f3ba2f',
    decimals: 18,
    sendGasLimit: sendGasLimits.NATIVE_EVM,
  },
  MATIC: {
    name: 'Polygon',
    chain: ChainId.Polygon,
    type: AssetTypes.native,
    code: 'MATIC',
    coinGeckoId: 'matic-network',
    color: '#8247e5',
    decimals: 18,
    sendGasLimit: sendGasLimits.NATIVE_EVM,
  },
};

const testnetNativeAssets = TESTNET_NATIVE.reduce(
  (assets: AssetMap, asset: string) => {
    return Object.assign(assets, {
      [asset]: {
        ...nativeAssets[asset],
      },
    });
  },
  {},
);

export { nativeAssets, testnetNativeAssets };
