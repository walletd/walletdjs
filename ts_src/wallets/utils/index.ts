import { ChainId, getChain } from '@liquality/cryptoassets';
import { AccountDefinition, Network } from '../../store/types';

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

export const createAccount = (
  network: Network,
  chainId: ChainId,
  index: number,
): AccountDefinition => {
  const chainDetails = getChain(network, chainId);
  const derivationPath = getDerivationPath(
    chainId,
    chainDetails.network.coinType,
    index,
  );
  return {
    type: 'default',
    name: chainDetails.name,
    chain: chainId,
    index: index,
    derivationPath: derivationPath,
    addresses: [],
    assets: chainDetails.nativeAsset,
    balances: {},
    color: chainDetails.color,
    enabled: true,
    createdAt: Date.now(),
    asset: chainDetails.nativeAsset[0],
    clientSettings: undefined,
  };
};
