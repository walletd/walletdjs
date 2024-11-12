import { type Network } from '@chainify/types';
import { type RootState } from './store/types.js';

export interface ParsedCipherText {
  ct: string;
  iv: string;
  s: string;
}

export interface Notification {
  title: string;
  message: string;
}

export interface WalletOptions {
  initialState?: RootState;

  crypto: {
    pbkdf2(
      password: string,
      salt: string,
      iterations: number,
      length: number,
      digest: string,
    ): Promise<string>;
    encrypt(value: string, key: string): Promise<any>;
    decrypt(value: any, key: string): Promise<any>;
  };

  createNotification(notification: Notification): void;
  //   ledgerTransportCreator?: TransportCreator;
}

export interface ChainifyNetwork extends Network {
  scraperUrl?: string;
  batchScraperUrl?: string;
  feeProviderUrl?: string;
}

export enum AssetTypes {
  native = 'native',
  erc20 = 'erc20',
}

export type AssetType = AssetTypes.native | AssetTypes.erc20;

export enum ChainId {
  Bitcoin = 'bitcoin',
  Ethereum = 'ethereum',
  Solana = 'solana',
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
