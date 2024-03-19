import { currencyToUnit, nativeAssets, unitToCurrency } from '../../assets';
import { HDWallet } from '../index';
import { ChainId } from '@liquality/cryptoassets';
import { BitcoinNetworks } from '@chainify/bitcoin';
import { SolanaNetworks } from '@chainify/solana';
import { EvmNetworks } from '@chainify/evm';
import { Network } from '../../store/types';

(async () => {
  const wallet = {
    id: 'test_wallet',
    name: 'test wallet',
    mnemonic:
      'black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit',
    at: 1710772632,
    imported: true,
  };

  const hdWallet = new HDWallet(wallet.mnemonic);
  const assets = [
    {
      type: 'default',
      name: 'Bitcoin',
      chain: ChainId.Bitcoin,
      index: 0,
      derivationPath: "m/84'/1'/0'",
      addresses: [],
      assets: ['native'],
      balances: { native: 0 },
      color: '#000000',
      enabled: true,
      createdAt: 1710772632,
      asset: nativeAssets.BTC,
      sendAddress: 'bcrt1qj8nvf3k2cdc6h5ach09zeapkell6sqng5u946l',
      clientSettings: {
        network: Network.Testnet,
        chainifyNetwork: {
          ...BitcoinNetworks.bitcoin_testnet,
          scraperUrl: 'https://esplora.private.com/testnet/api/',
          batchScraperUrl: 'https://esplora-batch.private.com',
        },
      },
    },
    {
      type: 'default',
      name: 'Ethereum',
      chain: ChainId.Ethereum,
      index: 0,
      derivationPath: "m/44'/60'/0'/0/0",
      addresses: [],
      assets: ['native'],
      balances: { native: 0 },
      color: '#000000',
      enabled: true,
      createdAt: 1710772632,
      asset: nativeAssets.ETH,
      sendAddress: '0xC674B334E12f92E45fD481A070437bDB9848FD33',
      clientSettings: {
        network: Network.Testnet,
        chainifyNetwork: EvmNetworks.ganache,
      },
    },
    {
      type: 'default',
      name: 'Binance Smart Chain',
      chain: ChainId.BinanceSmartChain,
      index: 0,
      derivationPath: "m/44'/60'/0'/0/0",
      addresses: [],
      assets: ['native'],
      balances: { native: 0 },
      color: '#000000',
      enabled: true,
      createdAt: 1710772632,
      asset: nativeAssets.BNB,
      sendAddress: '0xC674B334E12f92E45fD481A070437bDB9848FD33',
      clientSettings: {
        network: Network.Testnet,
        chainifyNetwork: EvmNetworks.bsc_testnet,
      },
    },
    {
      type: 'default',
      name: 'Polygon',
      chain: ChainId.Polygon,
      index: 0,
      derivationPath: "m/44'/60'/0'/0/0",
      addresses: [],
      assets: ['native'],
      balances: { native: 0 },
      color: '#000000',
      enabled: true,
      createdAt: 1710772632,
      asset: nativeAssets.MATIC,
      sendAddress: '0xC674B334E12f92E45fD481A070437bDB9848FD33',
      clientSettings: {
        network: Network.Testnet,
        chainifyNetwork: EvmNetworks.polygon_testnet,
      },
    },
    {
      type: 'default',
      name: 'Solana',
      chain: ChainId.Solana,
      index: 0,
      derivationPath: "m/44'/501'/0'/0'",
      addresses: [],
      assets: ['native'],
      balances: { native: 0 },
      color: '#000000',
      enabled: true,
      createdAt: 1710772632,
      asset: nativeAssets.SOL,
      sendAddress: '0xC674B334E12f92E45fD481A070437bDB9848FD33',
      clientSettings: {
        network: Network.Testnet,
        chainifyNetwork: SolanaNetworks.solana_testnet,
      },
    },
  ];

  // fetch chain settings by chain id


  for (const asset of assets) {
    console.log(asset.asset.name);
    const client = hdWallet.createWallet(
      asset.chain,
      asset,
      asset.clientSettings,
    );
    const blockHeight = await client.chain.getBlockHeight();
    console.log(asset.asset.code + ' ' + 'Blocks ' + blockHeight);
    const addressNew = await client.wallet.getAddress();
    const balance = await client.wallet.getBalance([asset.asset]);
    console.log(
      asset.asset.code +
        ' ' +
        unitToCurrency(asset.asset, balance[0]).toString(),
    );
    console.log(addressNew.toString());
    const amountToSend = currencyToUnit(asset.asset, 0.0001);
    console.log(asset.asset.code + ' ' + amountToSend);
    //   await client.wallet.sendTransaction({
    //     to: asset.asset.sendAddress,
    //     value: amountToSend,
    //   });
  }
})();
