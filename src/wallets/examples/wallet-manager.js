"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = require("../../assets");
const uuid_1 = require("uuid");
const index_1 = require("../index");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bitcoin_1 = require("../../bitcoin");
const evm_1 = require("../../evm");
const types_1 = require("../../store/types");
const utils_1 = require("../utils");
(async () => {
    const networks = [types_1.Network.Testnet];
    const chainIds = [
        cryptoassets_1.ChainId.Bitcoin,
        cryptoassets_1.ChainId.Ethereum,
        cryptoassets_1.ChainId.BinanceSmartChain,
        cryptoassets_1.ChainId.Polygon,
        cryptoassets_1.ChainId.Solana,
    ];
    const wallet = {
        id: (0, uuid_1.v4)(),
        name: 'test wallet',
        mnemonic: 'black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit',
        at: Date.now(),
        imported: true,
    };
    const hdWallet = new index_1.HDWallet(wallet.mnemonic);
    const accounts = [];
    for (const network of networks) {
        for (const chainId of chainIds) {
            accounts.push((0, utils_1.createAccount)(network, chainId, 0));
        }
    }
    // fetch chain settings by chain id
    for (const account of accounts) {
        let chainSettings;
        if (account.chain === cryptoassets_1.ChainId.Bitcoin) {
            chainSettings = {
                network: types_1.Network.Testnet,
                chainifyNetwork: {
                    ...bitcoin_1.BitcoinNetworks.bitcoin_testnet,
                    scraperUrl: 'https://esplora.tekkzbadger.com/testnet/api/',
                    batchScraperUrl: 'https://esplora-batch.tekkzbadger.com',
                },
            };
        }
        else if (account.chain === cryptoassets_1.ChainId.Ethereum) {
            chainSettings = {
                chainifyNetwork: {
                    ...evm_1.EvmNetworks.sepolia,
                },
            };
        }
        else {
            const chainDetails = (0, cryptoassets_1.getChain)(types_1.Network.Testnet, account.chain);
            chainSettings = {
                network: types_1.Network.Testnet,
                chainifyNetwork: {
                    ...chainDetails.network,
                    rpcUrl: chainDetails.network.rpcUrls[0],
                },
            };
        }
        console.log(chainSettings);
        return;
        console.log(account.name);
        const client = hdWallet.createWallet(account.chain, account, chainSettings);
        const blockHeight = await client.chain.getBlockHeight();
        console.log(account.asset.code + ' ' + 'Blocks ' + blockHeight);
        const addressNew = await client.wallet.getAddress();
        const balance = await client.wallet.getBalance([account.asset]);
        console.log(account.asset.code +
            ' ' +
            (0, assets_1.unitToCurrency)(account.asset, balance[0]).toString());
        console.log(addressNew.toString());
        const amountToSend = (0, assets_1.currencyToUnit)(account.asset, 0.0001);
        console.log(account.asset.code + ' ' + amountToSend);
        //   await client.wallet.sendTransaction({
        //     to: asset.asset.sendAddress,
        //     value: amountToSend,
        //   });
    }
})();
