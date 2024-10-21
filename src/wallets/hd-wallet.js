"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDWallet = void 0;
const ecc = require("tiny-secp256k1");
const bip39 = require("bip39");
const bip32_1 = require("bip32");
const clients_1 = require("./clients");
const types_1 = require("../store/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bip32 = (0, bip32_1.default)(ecc);
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
    createWallet(chainId, accountInfo, clientSettings) {
        const chain = (0, cryptoassets_1.getChain)(types_1.Network.Testnet, chainId);
        if (chain.isEVM) {
            return (0, clients_1.createEvmClient)(chain, clientSettings, this.mnemonic, accountInfo);
        }
        // covers regtest as well
        if (chainId === cryptoassets_1.ChainId.Bitcoin) {
            return (0, clients_1.createBtcClient)(clientSettings, this.mnemonic, accountInfo);
        }
        if (chainId === cryptoassets_1.ChainId.Solana) {
            return (0, clients_1.createSolanaClient)(clientSettings, this.mnemonic, accountInfo);
        }
        throw new Error('Unsupported coin type');
    }
}
exports.HDWallet = HDWallet;
