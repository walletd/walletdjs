"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const bitcoin_1 = require("../bitcoin");
const ecc = require("tiny-secp256k1");
const bip39 = require("bip39");
const bip32_1 = require("bip32");
const bip32 = (0, bip32_1.default)(ecc);
class Wallet {
  constructor(mnemonic) {
    this.mnemonic = mnemonic;
    this.seed = bip39.mnemonicToSeedSync(mnemonic);
    this.root = bip32.fromSeed(this.seed);
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
  bitcoinWallet(type) {
    return new bitcoin_1.BitcoinWallet(this.root, type);
  }
}
exports.Wallet = Wallet;
