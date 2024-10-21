"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvmClient = exports.createSolanaClient = exports.createBtcClient = void 0;
const client_1 = require("@chainify/client");
const bitcoin_1 = require("@chainify/bitcoin");
const evm_1 = require("@chainify/evm");
const providers_1 = require("@ethersproject/providers");
const solana_1 = require("@chainify/solana");
function createBtcClient(settings, mnemonic, accountInfo) {
    //   const isMainnet = settings.network === 'mainnet';
    const { chainifyNetwork } = settings;
    const chainProvider = new bitcoin_1.BitcoinEsploraApiProvider({
        batchUrl: chainifyNetwork.batchScraperUrl,
        url: chainifyNetwork.scraperUrl,
        network: chainifyNetwork,
        numberOfBlockConfirmation: 2,
    });
    const WalletProvider = new bitcoin_1.BitcoinHDWalletProvider({
        mnemonic,
        network: chainifyNetwork,
        baseDerivationPath: accountInfo.derivationPath,
    }, chainProvider);
    return new client_1.Client().connect(WalletProvider);
}
exports.createBtcClient = createBtcClient;
function createSolanaClient(settings, mnemonic, accountInfo) {
    const walletOptions = {
        mnemonic,
        derivationPath: accountInfo.derivationPath,
    };
    const chainProvider = new solana_1.SolanaChainProvider(settings.chainifyNetwork);
    const walletProvider = new solana_1.SolanaWalletProvider(walletOptions, chainProvider);
    return new client_1.Client(chainProvider, walletProvider);
}
exports.createSolanaClient = createSolanaClient;
function createEvmClient(chain, settings, mnemonic, accountInfo) {
    const chainProvider = getEvmProvider(chain, settings);
    const walletProvider = getEvmWalletProvider(settings.chainifyNetwork, accountInfo, chainProvider, mnemonic);
    const client = new client_1.Client().connect(walletProvider);
    return client;
}
exports.createEvmClient = createEvmClient;
function getEvmWalletProvider(_network, accountInfo, chainProvider, mnemonic) {
    const walletOptions = {
        derivationPath: accountInfo.derivationPath,
        mnemonic,
    };
    return new evm_1.EvmWalletProvider(walletOptions, chainProvider);
}
function getEvmProvider(chain, settings) {
    const network = settings.chainifyNetwork;
    const provider = new providers_1.StaticJsonRpcProvider(network.rpcUrl, chain.network.chainId);
    return new evm_1.EvmChainProvider(chain.network, provider);
}
