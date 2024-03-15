import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { Client } from '@chainify/client';
import {
  BitcoinEsploraApiProvider,
  BitcoinHDWalletProvider,
  BitcoinNetworks,
} from '@chainify/bitcoin';
import { EvmProviderOptions, BtcProviderOptions } from '../assets/networks';
import { EvmChainProvider, EvmWalletProvider } from '@chainify/evm';

const bip32 = BIP32Factory(ecc);

export enum CoinTypes {
  bitcoin = 0,
  testnet = 1,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  regtest = 1,
  ethereum = 60,
}

export class HDWallet {
  mnemonic: string;
  seed: Buffer;
  root: BIP32Interface;

  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
    this.seed = bip39.mnemonicToSeedSync(mnemonic);
    this.root = bip32.fromSeed(this.seed);
  }

  static generate(): HDWallet {
    return new HDWallet(bip39.generateMnemonic(256));
  }

  xpriv(): string {
    return this.root.toBase58();
  }

  xpub(): string {
    return this.root.neutered().toBase58();
  }

  createWallet(type: CoinTypes): Client {
    if (type === CoinTypes.ethereum) {
      const ethClient = new Client();
      ethClient.connect(
        new EvmWalletProvider(
          {
            mnemonic: this.mnemonic,
            derivationPath: "m/44'/60'/0'/0/0",
          },
          new EvmChainProvider(EvmProviderOptions.ganache),
        ),
      );
      return ethClient;
    }
    // covers regtest as well
    if (type === CoinTypes.testnet) {
      const client = new Client();
      client.connect(
        new BitcoinHDWalletProvider(
          {
            mnemonic: this.mnemonic,
            network: BitcoinNetworks.bitcoin_regtest,
            baseDerivationPath: "m/84'/1'/0'",
          },
          new BitcoinEsploraApiProvider(BtcProviderOptions.regtestBatch),
        ),
      );

      return client;
    }

    throw new Error('Unsupported coin type');
  }
}
