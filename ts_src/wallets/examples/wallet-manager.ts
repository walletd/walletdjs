import { Client } from '@chainify/client';
import { CoinTypes, WalletManager } from '../';
import {
  BitcoinEsploraApiProvider,
  BitcoinHDWalletProvider,
  BitcoinNetworks,
} from '@chainify/bitcoin';
import { nativeAssets } from '../../assets/native';
import { BigNumber } from '@chainify/types';

(async () => {
  const walletManager = new WalletManager();
  const hdWallet = walletManager.createHDWallet();
  // btc
  const btcWallet = hdWallet.createWallet(CoinTypes.testnet);
  const address = await btcWallet.getAddress();
  console.log(address.toString());
  const address2 = await btcWallet.getAddresses(1, 1);
  console.log(address2.toString());
  console.log(await btcWallet.provider.getBlockHeight());
  // eth
  const ethWallet = hdWallet.createWallet(CoinTypes.ethereum);
  console.log((await ethWallet.getAddress()).toString());
  console.log(await ethWallet.provider.getBlockHeight());
  console.log(await ethWallet.getBalance());

  const client = new Client();

  client.connect(
    new BitcoinEsploraApiProvider({
      url: 'http://localhost:3002',
      batchUrl: 'http://localhost:5003',
      network: BitcoinNetworks.bitcoin_regtest,
    }),
  );

  const blockHeight = await client.chain.getBlockHeight();
  console.log('Blocks ' + blockHeight);
  const client2 = new Client();
  client2.connect(
    new BitcoinHDWalletProvider(
      {
        mnemonic:
          'under visa else sweet voice result asset notable invite interest young abuse',
        network: BitcoinNetworks.bitcoin_regtest,
        baseDerivationPath: "m/84'/1'/0'",
      },
      new BitcoinEsploraApiProvider({
        url: 'http://localhost:3002',
        batchUrl: 'http://localhost:5003',
        network: BitcoinNetworks.bitcoin_regtest,
      }),
    ),
  );

  const addressNew = await client2.wallet.getAddress();
  const balance = await client2.wallet.getBalance([nativeAssets.BTC]);
  console.log(balance.toString());
  console.log(addressNew.toString());
  await client2.wallet.sendTransaction({
    to: 'bcrt1qj8nvf3k2cdc6h5ach09zeapkell6sqng5u946l',
    value: BigNumber(100000),
  });
})();
