export enum AssetTypes {
  native = 'native',
  erc20 = 'erc20',
}

export type AssetType = AssetTypes.native | AssetTypes.erc20;

export enum ChainId {
  Bitcoin = 'bitcoin',
  Ethereum = 'ethereum',
  Solana = 'solana',
  BinanceSmartChain = 'binance',
  Polygon = 'polygon',
}

export interface Asset {
  name: string;
  chain: ChainId;
  type: AssetType;
  code: string;
  decimals: number;
  coinGeckoId?: string;
  color?: string;
  contractAddress?: string; // ERC20 only
  matchingAsset?: string;
  feeAsset?: string;
  sendGasLimit: number;
}

export type AssetMap = Record<string, Asset>;

export interface Chain {
  name: string;
  code: string;
  nativeAsset: string;
  fees: {
    unit: string;
  };
  safeConfirmations: number;
  txFailureTimeout: number;
  evmCompatible: boolean;
  hasTokens: boolean;
  supportCustomFees: boolean;
  isValidAddress: (address: string, network?: string) => boolean;
  formatAddress: (address: string, network?: string) => string;
  isValidTransactionHash: (hash: string) => boolean;
  formatTransactionHash: (hash: string) => string;
}
