import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';

const bip32 = BIP32Factory(ecc);

class Wallet {
    legacyAddress: string;
    primaryAddress: string;
    mnemonic: string;
    seed: Buffer;
    root: BIP32Interface;
    network: bitcoin.Network = bitcoin.networks.testnet;
    lookahead: number = 5;

    constructor(mnemonic: string) {
        this.mnemonic = mnemonic;
        this.seed = bip39.mnemonicToSeedSync(mnemonic);
        this.root = bip32.fromSeed(this.seed);
        this.legacyAddress =  this.generateLegacyAddress();
        this.primaryAddress = this.generateAddress();
    }
    static generate() : Wallet {
        return new Wallet(bip39.generateMnemonic(256));
    }

    xpriv() : string {
        return this.root.toBase58();
    }

    xpub() : string {
        return this.root.neutered().toBase58();
    }

    generateLegacyAddress(index? : number) : string {
        if (typeof index === 'undefined') {
            index = 0;
        }
        const path = "m/0/" + index; // bip32 
        const child = this.root.derivePath(path);
        return bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: this.network }).address!;
    }

    generateAddress(index? : number) : string {
        if (typeof index === 'undefined') {
            index = 0;
        }
        let coinType = 0;
        if (this.network === bitcoin.networks.testnet) {
            coinType = 1;
        }
        const path = "m/84'/" + coinType + "'/0'/0/" + index; // bip84 bech32
        const child = this.root.derivePath(path);
        return bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: this.network }).address!;
    }
}
const wallet = new Wallet("crew secret spare arrow blanket salute trash similar coin illness asthma urban olympic sugar heavy brave pulse museum foil feed crouch brief desk wish");
//const wallet = Wallet.generate();
console.log(wallet.mnemonic);
console.log(wallet.seed);
console.log(wallet.xpriv());
console.log(wallet.xpub()); 
console.log(wallet.legacyAddress);
console.log(wallet.generateAddress());
console.log(wallet.generateAddress(5));