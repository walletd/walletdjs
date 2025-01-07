import { ChainId, getChain } from '@liquality/cryptoassets';
import { Network } from '../../store/types.js';
import type { IAsset } from '../../assets/interfaces/IAsset.js';
import { ChainId as LocalChainId } from '../../assets/types.js';

import { ChainId as ChainifyChainId, type Asset } from '@chainify/types';

export const getDerivationPath = (
  chainId: ChainId,
  coinType: string,
  index: number,
) => {
  switch (chainId) {
    case ChainId.Bitcoin:
      return `m/84'/${coinType}'/${index}'`;
    case ChainId.Ethereum:
      return `m/44'/${coinType}'/0'/0/${index}`;
    case ChainId.BinanceSmartChain:
      return `m/44'/${coinType}'/0'/0/${index}`;
    case ChainId.Polygon:
      return `m/44'/${coinType}'/0'/0/${index}`;
    case ChainId.Solana:
      return `m/44'/${coinType}'/0'/0'`;
    default:
      return `m/44'/${coinType}'/0'/0/${index}`;
  }
};

export class AccountHolder {
  network: Network;
  chainId: ChainId;
  index: number;
  chainDetails: any;
  derivationPath: string;
  account: any;
  iAsset: IAsset;
  asset2: Asset;

  constructor(network: Network, chainId: ChainId, index: number) {
    this.network = network;
    this.chainId = chainId;
    this.index = index;
    this.chainDetails = getChain(network, chainId);
    this.derivationPath = getDerivationPath(
      chainId,
      this.chainDetails.network.coinType,
      index,
    );
    this.account = {
      type: 'default',
      name: this.chainDetails.name,
      chain: chainId,
      index: index,
      derivationPath: this.derivationPath,
      addresses: [],
      assets: this.chainDetails.nativeAsset,
      balances: {},
      color: this.chainDetails.color,
      enabled: true,
      createdAt: Date.now(),
      asset: this.chainDetails.nativeAsset[0],
      clientSettings: undefined,
    };
    this.iAsset = {
      name: this.account.asset.name,
      chain: (() => {
        switch (this.account.asset?.chain) {
          case ChainId.Bitcoin:
            return LocalChainId.Bitcoin;
          case ChainId.Ethereum:
            return LocalChainId.Ethereum;
          case ChainId.BinanceSmartChain:
            return LocalChainId.BinanceSmartChain;
          case ChainId.Solana:
            return LocalChainId.Solana;
          // Add other cases as needed
          default:
            throw new Error(`Unsupported chain: ${this.account.asset?.chain}`);
        }
      })(),
      type: this.account.asset?.type,
      code: this.account.asset?.code,
      decimals: this.account.asset?.decimals,
      contractAddress: this.account.asset?.contractAddress,
      color: this.account.asset?.color,
      priceSource: this.account.asset?.priceSource,
      matchingAsset: this.account.asset?.matchingAsset,
      feeAsset: this.account.asset?.feeAsset,
    };
    this.asset2 = {
      ...this.account.asset,
      chain: (() => {
        switch (this.account.asset.chain) {
          case ChainId.Bitcoin:
            return ChainifyChainId.Bitcoin;
          case ChainId.Ethereum:
            return ChainifyChainId.Ethereum;
          case ChainId.BinanceSmartChain:
            return ChainifyChainId.BinanceSmartChain;
          case ChainId.Solana:
            return ChainifyChainId.Solana;
          // Add other cases as needed
          default:
            throw new Error(`Unsupported chain: ${this.account.asset.chain}`);
        }
      })(),
    };
  }
}

export const createAccount = (
  network: Network,
  chainId: ChainId,
  index: number,
) => {
  return new AccountHolder(network, chainId, index);
  //   const chainDetails = getChain(network, chainId);
  //   const derivationPath = getDerivationPath(
  //     chainId,
  //     chainDetails.network.coinType,
  //     index,
  //   );
  //   return {
  //     type: 'default',
  //     name: chainDetails.name,
  //     chain: chainId,
  //     index: index,
  //     derivationPath: derivationPath,
  //     addresses: [],
  //     assets: chainDetails.nativeAsset,
  //     balances: {},
  //     color: chainDetails.color,
  //     enabled: true,
  //     createdAt: Date.now(),
  //     asset: chainDetails.nativeAsset[0],
  //     clientSettings: undefined,
  //   };
};
