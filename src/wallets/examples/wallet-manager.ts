import { currencyToUnit, unitToCurrency } from '../../assets/index.js';
import { v4 as uuidv4 } from 'uuid';
import { HDWallet } from '../index.js';
import { ChainId, getChain } from '@liquality/cryptoassets';
import { BitcoinNetworks } from '../../bitcoin/index.js';
import { EvmNetworks } from '../../evm/index.js';
import { Network } from '../../store/types.js';
import { createAccount } from '../utils/index.js';

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
      {
        // name: string;
        // chain: ChainId;
        // type: AssetType;
        // code: string;
        // decimals: number;
        // priceSource?: PriceSources;
        // color?: string;
        // contractAddress?: string;
        // matchingAsset?: string;
        // feeAsset?: string;
      }

      const balance = await client.wallet.getBalance([account.asset]);
      console.log(
        account.asset?.code +
          ' ' +
          unitToCurrency(account.asset, balance[0]).toString(),
      );
      console.log(addressNew.toString());
      const amountToSend = currencyToUnit(account.asset, 0.0001);
      console.log(account.asset?.code + ' ' + amountToSend);
      //   await client.wallet.sendTransaction({
      //     to: asset.asset.sendAddress,
      //     value: amountToSend,
      //   });
    }
  }
})();
