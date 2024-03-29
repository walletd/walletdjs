import { AddressType, BitcoinWallet } from '../bitcoin';
import { EthClient } from '../ethereum';
import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import { BaseWallet } from '.';

const bip32 = BIP32Factory(ecc);

export enum CoinTypes {
    bitcoin = 0,
    testnet = 1,
    regtest = 1,
    ethereum = 60
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

    static generate() : HDWallet {
        return new HDWallet(bip39.generateMnemonic(256));
    }

    xpriv() : string {
        return this.root.toBase58();
    }

    xpub() : string {
        return this.root.neutered().toBase58();
    }

    createWallet(type: CoinTypes) : BaseWallet {
        if (type === CoinTypes.ethereum) {
            return EthClient.fromPhrase(this.mnemonic);
        }
         // covers regtest as well
        if (type === CoinTypes.testnet) {
            return new BitcoinWallet(this.root, AddressType.p2wpkh);
        }

        throw new Error("Unsupported coin type");
    }


    testnetWallet(type?: AddressType) : BitcoinWallet {
        if (type === undefined) {
            type = AddressType.p2wpkh;
        }
        return new BitcoinWallet(this.root, type);
    }
}
