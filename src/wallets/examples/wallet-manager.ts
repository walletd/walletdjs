import { currencyToUnit, unitToCurrency } from '../../assets/index.js';
import { v4 as uuidv4 } from 'uuid';
import { HDWallet } from '../index.js';
import { ChainId, getChain } from '@liquality/cryptoassets';
import type { IAsset } from '../../assets/interfaces/IAsset.js';
import { ChainId as LocalChainId } from '../../assets/types.js';
import { BitcoinNetworks } from '../../bitcoin/index.js';
import { EvmNetworks } from '../../evm/index.js';
import { Network } from '../../store/types.js';
import { createAccount } from '../utils/index.js';
import { ChainId as ChainifyChainId, type Asset } from '@chainify/types';

(async () => {
  const networks = [Network.Testnet];
  const chainIds = [
    ChainId.Bitcoin,
    ChainId.Ethereum,
    ChainId.BinanceSmartChain,
    // ChainId.Polygon,
    ChainId.Solana,
  ];
  const wallet = {
    id: uuidv4(),
    name: 'test wallet',
    mnemonic:
      'black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit',
    at: Date.now(),
    imported: true,
  };

  const hdWallet = new HDWallet(wallet.mnemonic);
  const accounts = [];
  for (const network of networks) {
    for (const chainId of chainIds) {
      accounts.push(createAccount(network, chainId, 0));
    }
  }
  // fetch chain settings by chain id

  for (const account of accounts) {
    let chainSettings;
    if (account.chain === ChainId.Bitcoin) {
      chainSettings = {
        network: Network.Testnet,
        chainifyNetwork: {
          ...BitcoinNetworks.bitcoin_testnet,
          scraperUrl: 'https://esplora.tekkzbadger.com/testnet/api/',
          batchScraperUrl: 'https://esplora-batch.tekkzbadger.com',
        },
      };
    } else if (account.chain === ChainId.Ethereum) {
      chainSettings = {
        network: Network.Testnet,
        chainifyNetwork: {
          ...EvmNetworks.sepolia,
          //rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
          rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
        },
      };
    } else {
      const chainDetails = getChain(Network.Testnet, account.chain);
      chainSettings = {
        network: Network.Testnet,
        chainifyNetwork: {
          ...chainDetails.network,
          rpcUrl: chainDetails.network.rpcUrls[0],
        },
      };
    }

    console.log(account.name);
    const client = hdWallet.createWallet(account.chain, account, chainSettings);
    const blockHeight = await client.chain.getBlockHeight();
    console.log(account.asset?.code + ' ' + 'Blocks ' + blockHeight);
    const addressNew = await client.wallet.getAddress();
    if (account.asset !== undefined) {
    const asset2: Asset = {
      ...account.asset,
      chain: (() => {
        switch (account.asset.chain) {
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
          throw new Error(`Unsupported chain: ${account.asset.chain}`);
        }
      })()
    }

    const iAsset: IAsset = {
        name: account.asset.name,
        chain: (() => {
            switch (account.asset?.chain) {
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
              throw new Error(`Unsupported chain: ${account.asset?.chain}`);
            }})(),
            type: account.asset?.type,
            code: account.asset?.code,
            decimals: account.asset?.decimals,
            contractAddress: account.asset?.contractAddress,
            color: account.asset?.color,
            priceSource: account.asset?.priceSource,
            matchingAsset: account.asset?.matchingAsset,
            feeAsset: account.asset?.feeAsset,
     }
    

      const balance = await client.wallet.getBalance([asset2]);
      if (balance[0] !== undefined) {
        console.log(
          account.asset?.code +
            ' ' +
            unitToCurrency(iAsset, balance[0]).toString(),
        );
      } else {
        console.log(`${account.asset?.code} balance is undefined`);
      }
      console.log(addressNew.toString());
      const amountToSend = currencyToUnit(iAsset, 0.0001);
      console.log(account.asset?.code + ' ' + amountToSend);
      //   await client.wallet.sendTransaction({
      //     to: asset.asset.sendAddress,
      //     value: amountToSend,
      //   });
    }
  }
})();
