"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ecc = require("tiny-secp256k1");
const bitcoin = require("bitcoinjs-lib");
const bip32_1 = require("bip32");
const bip39 = require("bip39");
const bip32 = (0, bip32_1.default)(ecc);
class Wallet {
  constructor(mnemonic) {
    this.network = bitcoin.networks.testnet;
    this.mnemonic = mnemonic;
    this.seed = bip39.mnemonicToSeedSync(mnemonic);
    this.root = bip32.fromSeed(this.seed);
    this.legacyAddress = this.generateLegacyAddress();
  }
  static generate() {
    return new Wallet(bip39.generateMnemonic(256));
  }
  xpriv() {
    return this.root.toBase58();
  }
  xpub() {
    return this.root.neutered().toBase58();
  }
  generateLegacyAddress(index) {
    if (typeof index === "undefined") {
      index = 0;
    }
    const path = "m/0/" + index; // bip32
    const child = this.root.derivePath(path);
    return bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
      network: this.network,
    }).address;
  }
  generateAddress(index) {
    if (typeof index === "undefined") {
      index = 0;
    }
    const path = "m/84'/1'/0'/0/" + index; // bip84 bech32
    const child = this.root.derivePath(path);
    return bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: this.network,
    }).address;
  }
}
const wallet = new Wallet(
  "crew secret spare arrow blanket salute trash similar coin illness asthma urban olympic sugar heavy brave pulse museum foil feed crouch brief desk wish",
);
//const wallet = Wallet.generate();
console.log(wallet.mnemonic);
console.log(wallet.seed);
console.log(wallet.xpriv());
console.log(wallet.xpub());
console.log(wallet.legacyAddress);
console.log(wallet.generateAddress());
console.log(wallet.generateAddress(5));
