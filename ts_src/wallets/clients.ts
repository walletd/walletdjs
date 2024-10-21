import { Chain, Client, Swap, Wallet } from '@chainify/client';
import { AccountInfo, ClientSettings } from '../store/types';
import {
  BitcoinEsploraApiProvider,
  BitcoinHDWalletProvider,
  BitcoinTypes,
} from '@chainify/bitcoin';
import { ChainifyNetwork } from '../types';
import { Network } from '@chainify/types';
import { EvmChain } from '@liquality/cryptoassets';
import { EvmChainProvider, EvmWalletProvider } from '@chainify/evm';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { SolanaChainProvider, SolanaWalletProvider } from '@chainify/solana';

export function createBtcClient(
  settings: ClientSettings<ChainifyNetwork>,
  mnemonic: string,
  accountInfo: AccountInfo,
): Client<
  Chain<any, Network>,
  Wallet<any, any>,
  Swap<any, any, Wallet<any, any>>
> {
  //   const isMainnet = settings.network === 'mainnet';
  const { chainifyNetwork } = settings;
  const chainProvider = new BitcoinEsploraApiProvider({
    batchUrl: chainifyNetwork.batchScraperUrl!,
    url: chainifyNetwork.scraperUrl!,
    network: chainifyNetwork as BitcoinTypes.BitcoinNetwork,
    numberOfBlockConfirmation: 2,
  });
  const WalletProvider = new BitcoinHDWalletProvider(
    {
      mnemonic,
      network: chainifyNetwork as BitcoinTypes.BitcoinNetwork,
      baseDerivationPath: accountInfo.derivationPath,
    },
    chainProvider,
  );

  return new Client().connect(WalletProvider);
}

export function createSolanaClient(
  settings: ClientSettings<ChainifyNetwork>,
  mnemonic: string,
  accountInfo: AccountInfo,
): Client<
  Chain<any, Network>,
  Wallet<any, any>,
  Swap<any, any, Wallet<any, any>>
> {
  const walletOptions = {
    mnemonic,
    derivationPath: accountInfo.derivationPath,
  };
  const chainProvider = new SolanaChainProvider(settings.chainifyNetwork);
  const walletProvider = new SolanaWalletProvider(walletOptions, chainProvider);

  return new Client(chainProvider as any, walletProvider as any);
}

export function createEvmClient(
  chain: EvmChain,
  settings: ClientSettings<ChainifyNetwork>,
  mnemonic: string,
  accountInfo: AccountInfo,
): Client<
  Chain<any, Network>,
  Wallet<any, any>,
  Swap<any, any, Wallet<any, any>>
> {
  const chainProvider = getEvmProvider(chain, settings);
  const walletProvider = getEvmWalletProvider(
    settings.chainifyNetwork,
    accountInfo,
    chainProvider,
    mnemonic,
  );
  const client = new Client().connect(walletProvider);

  return client;
}

function getEvmWalletProvider(
  _network: ChainifyNetwork,
  accountInfo: AccountInfo,
  chainProvider: EvmChainProvider,
  mnemonic: string,
) {
  const walletOptions = {
    derivationPath: accountInfo.derivationPath,
    mnemonic,
  };
  return new EvmWalletProvider(walletOptions, chainProvider);
}

function getEvmProvider(
  chain: EvmChain,
  settings: ClientSettings<ChainifyNetwork>,
) {
  const network = settings.chainifyNetwork;

  const provider = new StaticJsonRpcProvider(
    network.rpcUrl,
    chain.network.chainId,
  );
  return new EvmChainProvider(chain.network, provider);
}
