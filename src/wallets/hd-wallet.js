"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDWallet = exports.CoinTypes = void 0;
const bitcoin_1 = require("../bitcoin");
const ethereum_1 = require("../ethereum");
const ecc = require("tiny-secp256k1");
const bip39 = require("bip39");
const bip32_1 = require("bip32");
const bip32 = (0, bip32_1.default)(ecc);
var CoinTypes;
(function (CoinTypes) {
    CoinTypes[CoinTypes["bitcoin"] = 0] = "bitcoin";
    CoinTypes[CoinTypes["testnet"] = 1] = "testnet";
    CoinTypes[CoinTypes["regtest"] = 1] = "regtest";
    CoinTypes[CoinTypes["ethereum"] = 60] = "ethereum";
})(CoinTypes || (exports.CoinTypes = CoinTypes = {}));
class HDWallet {
    constructor(mnemonic) {
        this.mnemonic = mnemonic;
        this.seed = bip39.mnemonicToSeedSync(mnemonic);
        this.root = bip32.fromSeed(this.seed);
    }
    static generate() {
        return new HDWallet(bip39.generateMnemonic(256));
    }
    xpriv() {
        return this.root.toBase58();
    }
    xpub() {
        return this.root.neutered().toBase58();
    }
    createWallet(type) {
        if (type === CoinTypes.ethereum) {
            return ethereum_1.EthClient.fromPhrase(this.mnemonic);
        }
        // covers regtest as well
        if (type === CoinTypes.testnet) {
            return new bitcoin_1.BitcoinWallet(this.root, bitcoin_1.AddressType.p2wpkh);
        }
        throw new Error("Unsupported coin type");
    }
    testnetWallet(type) {
        if (type === undefined) {
            type = bitcoin_1.AddressType.p2wpkh;
        }
        return new bitcoin_1.BitcoinWallet(this.root, type);
    }
}
exports.HDWallet = HDWallet;
