import * as ecc from "tiny-secp256k1";
import * as bip39 from "bip39";
import BIP32Factory, { BIP32Interface } from "bip32";
import { BaseWallet } from ".";
import {
  BitcoinEsploraApiProvider,
  BitcoinNetworkProviders,
  BitcoinNetworks,
  BitcoinWallet,
  EthereumWallet,
  EvmChainProvider,
  EvmNetworks,
} from "../client";

const bip32 = BIP32Factory(ecc);

export enum CoinTypes {
  bitcoin = 0,
  testnet = 1,
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

  createWallet(type: CoinTypes): BaseWallet {
    let config = this.createConfig(type);
    if (type === CoinTypes.ethereum) {
        
        const ethProvider = new EvmChainProvider(config.network);
        return new EthereumWallet(config, ethProvider);
    }
    // covers regtest as well
    if (type === CoinTypes.testnet) {
      const provider = new BitcoinEsploraApiProvider(config.networkProvider);

      return new BitcoinWallet(config, provider);
    }

    throw new Error("Unsupported coin type");
  }

  createConfig(type: CoinTypes): any {
    if (type === CoinTypes.ethereum) {
      return {
        mnemonic: this.mnemonic,
        network: EvmNetworks.ganache,
        derivationPath: "m/44'/60'/0'/0/0",
      };
    }
    if (type === CoinTypes.testnet) {
      return {
        mnemonic: this.mnemonic,
        network: BitcoinNetworks.bitcoin_testnet,
        baseDerivationPath: "m/84'/1'/0'",
        networkProvider: BitcoinNetworkProviders.blockstream_testnet,
      };
    }
    if (type === CoinTypes.bitcoin) {
      return {
        mnemonic: this.mnemonic,
        network: BitcoinNetworks.bitcoin,
        baseDerivationPath: "m/84'/0'/0'",
        networkProvider: BitcoinNetworkProviders.blockstream,
      };
    }

    throw new Error("Unsupported coin type");
  }
}
