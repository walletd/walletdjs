import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { Client } from '@chainify/client';
import { createAccount } from './utils';

import {
  createBtcClient,
  createEvmClient,
  createSolanaClient,
} from './clients';
import { AccountInfo, ClientSettings, Network } from '../store/types';
import { getChain, ChainId } from '@liquality/cryptoassets';
import { ChainifyNetwork } from '../types';

const bip32 = BIP32Factory(ecc);
export interface WalletOptions {
  networks: Network[];
  chainIds: ChainId[];
}

export class HDWallet {
  mnemonic: string;
  seed: Buffer;
  root: BIP32Interface;
  networks: Network[];
  chainIds: ChainId[];
  accounts: AccountInfo[] = [];

  constructor(mnemonic: string, options?: WalletOptions) {
    this.mnemonic = mnemonic;
    this.seed = bip39.mnemonicToSeedSync(mnemonic);
    this.root = bip32.fromSeed(this.seed);
    this.networks = options?.networks || [Network.Mainnet, Network.Testnet];
    this.chainIds = options?.chainIds || [];
    for (const network of this.networks) {
      for (const chainId of this.chainIds) {
        this.accounts.push(createAccount(network, chainId, 0));
      }
    }
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

  createWallet(
    chainId: ChainId,
    accountInfo: AccountInfo,
    clientSettings: ClientSettings<ChainifyNetwork>,
  ): Client {
    const chain = getChain(Network.Testnet, chainId);
    if (chain.isEVM) {
      return createEvmClient(chain, clientSettings, this.mnemonic, accountInfo);
    }
    // covers regtest as well
    if (chainId === ChainId.Bitcoin) {
      return createBtcClient(clientSettings, this.mnemonic, accountInfo);
    }

    if (chainId === ChainId.Solana) {
      return createSolanaClient(clientSettings, this.mnemonic, accountInfo);
    }

    throw new Error('Unsupported coin type');
  }
}
