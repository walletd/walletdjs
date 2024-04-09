import { currencyToUnit, unitToCurrency } from '../../assets';
import { v4 as uuidv4 } from 'uuid';
import { HDWallet } from '../index';
import { ChainId, getChain } from '@liquality/cryptoassets';
import { BitcoinNetworks } from '@chainify/bitcoin';
import { Network } from '../../store/types';
import { Asset } from '@chainify/types';
import { IAsset } from '../../assets/interfaces/IAsset';
import { createAccount } from '../utils';

(async () => {
  const networks = [Network.Testnet];
  const chainIds = [
    ChainId.Bitcoin,
    ChainId.Ethereum,
    ChainId.BinanceSmartChain,
    ChainId.Polygon,
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
    console.log(account.asset.code + ' ' + 'Blocks ' + blockHeight);
    const addressNew = await client.wallet.getAddress();

    const assetCode: Asset = account.asset as unknown as Asset;
    const balance = await client.wallet.getBalance([assetCode]);
    console.log(
      account.asset.code +
        ' ' +
        unitToCurrency(
          account.asset as unknown as IAsset,
          balance[0],
        ).toString(),
    );
    console.log(addressNew.toString());
    const amountToSend = currencyToUnit(
      account.asset as unknown as IAsset,
      0.0001,
    );
    console.log(account.asset.code + ' ' + amountToSend);
    //   await client.wallet.sendTransaction({
    //     to: asset.asset.sendAddress,
    //     value: amountToSend,
    //   });
  }
})();
