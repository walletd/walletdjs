import { AddressType, BitcoinWallet } from '../bitcoin';
import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';

const bip32 = BIP32Factory(ecc);

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

    bitcoinWallet(type: AddressType) : BitcoinWallet {
        return new BitcoinWallet(this.root, type);
    }
}
