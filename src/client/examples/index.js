"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoin_1 = require("@chainify/bitcoin");
const bitcoin_2 = require("@chainify/bitcoin");
const __1 = require("../");
const walletOptions = {
    btc: {
        mnemonic: 'black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit',
        network: bitcoin_2.BitcoinNetworks.bitcoin_testnet,
        baseDerivationPath: "m/84'/1'/0'"
    },
    eth: {
        mnemonic: 'black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit',
        derivationPath: "m/44'/60'/0'/0/0"
    }
};
const BlockstreamEsploraTestnet = {
    url: 'https://blockstream.info/testnet/api/',
    network: bitcoin_2.BitcoinNetworks.bitcoin_testnet
};
const BlockstreamEsploraTestnet2 = {
    url: 'https://blockstream.info/testnet/api/',
    batchUrl: 'https://blockstream.info/testnet/api/',
    network: bitcoin_2.BitcoinNetworks.bitcoin_testnet
};
class BitcoinWallet {
    constructor(options, provider, baseProvider) {
        this.wallet = new bitcoin_1.BitcoinHDWalletProvider(options, provider);
        this.provider = provider;
        this.baseProvider = baseProvider;
    }
    async getAddresses(start, end) {
        return await this.wallet.getAddresses(start, end);
    }
    async getUsedAddresses() {
        return await this.wallet.getUsedAddresses(1);
    }
    // async getBalance (addresses: string[]) {
    //     return await this.wallet.getBalance(addresses)
    // }
    // async getTransactionList (addresses: string[]) {
    //     return await this.baseProvider.getTransactionList(addresses)
    // }
    async getUnspentTransactions(addresses) {
        return await this.baseProvider.getUnspentTransactions(addresses);
    }
}
async function test() {
    const provider2 = new bitcoin_1.BitcoinEsploraBaseProvider(BlockstreamEsploraTestnet); // because you cant create a connection without the multi-provider
    const provider = new bitcoin_1.BitcoinEsploraApiProvider(BlockstreamEsploraTestnet2, provider2);
    const bitcoin = new BitcoinWallet(walletOptions.btc, provider, provider2);
    // const address = await bitcoin.getAddresses(0,1)
    // collect all addresses
    // get balance for all addresses
    // get transaction list for all addresses
    // get utxos for all addresses
    const usedAddresses = await bitcoin.getUsedAddresses();
    console.log(usedAddresses);
    // console.log(await bitcoin.getUnspentTransactions(address))
    // console.log((await bitcoin.getBalance([])).toString())
    // Fetch height and block hash
    const height = await provider.getBlockHeight();
    console.log(height);
    // Ethereum
    const ethProvider = new __1.EvmChainProvider(__1.EvmNetworks.ganache);
    console.log(await ethProvider.getBlockHeight());
    const txs = [
        '0x3a5e53533c35c03c8fe4de7a55c9939e8fee9e5b59f3f1cba8b40214530d4631',
        '0x087b804209b3ceb453cdf58167db007ba668f8ea87f95abbbbfb9d176b58b963',
        '0x726537f1fb238dc97b9a89c4a374ef7328a96ac812de810833d826648bd710f7',
    ];
    console.log(await ethProvider.getTransactionByHash(txs[0]));
    const ethWallet = new __1.EthereumWallet(walletOptions.eth, ethProvider);
    console.log(await ethWallet.getAddress());
    console.log(await ethWallet.getBalance());
    console.log(await ethWallet.estimateGas('0x52F810f5F37cb68530672F25FfF18160355e8221', 21000));
    //console.log(await ethWallet.sendTransaction('0x52F810f5F37cb68530672F25FfF18160355e8221', 21000))
    // Sign a message
    // const signedMessageBitcoin = await bitcoin.wallet.signMessage(
    //   'The Times 3 January 2009 Chancellor on brink of second bailout for banks', bitcoinAddress
    // )
    // console.log(signedMessageBitcoin)
    // const signedMessageEthereum = await ethereum.wallet.signMessage(
    //   'The Times 3 January 2009 Chancellor on brink of second bailout for banks', ethereumAddress
    // )
}
test();
// build out a config data object, this will include the node url, the network, and the wallet mnemonic
// allow the storing of ethereum transactions in the wallet
// store and retrieve ethereum transactions
// bitcoin all the storing of transactions.
// store and retrieve bitcoin transactions
// store and retrieve bitcoin utxos
// store and retrieve bitcoin addresses