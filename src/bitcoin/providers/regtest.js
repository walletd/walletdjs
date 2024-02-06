"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regtest = void 0;
const bitcoin = require('bitcoinjs-lib');
const regtest_client_1 = require("regtest-client");
const fetch = require('node-fetch');
const regtestUtils = new regtest_client_1.RegtestUtils(bitcoin);
class Regtest {
    constructor(url) {
        this.url = 'http://127.0.0.1:8080/1';
        if (url !== undefined) {
            this.url = url;
        }
    }
    network() {
        return regtestUtils.network;
    }
    mineBlocks(n) {
        return regtestUtils.mine(n);
    }
    faucet(address, amount) {
        return regtestUtils.faucet(address, amount);
    }
    verify(txo) {
        return regtestUtils.verify(txo);
    }
    broadcast(txHex) {
        return regtestUtils.broadcast(txHex);
    }
    getBlockByHash(hash) {
        throw new Error("Method not implemented." + hash);
    }
    getBlockNumber() {
        throw new Error("Method not implemented.");
    }
    getTransaction(txId) {
        return regtestUtils.fetch(txId);
    }
    async getTransactions(address) {
        const response = await fetch(this.url + '/a/' + address + '/txs', {
            method: 'GET',
        });
        console.log(await response.json());
        //   return response.json();
    }
    async height() {
        const response = await fetch(this.url + '/b/best/height', {
            method: 'GET',
        });
        return response.json();
    }
}
exports.Regtest = Regtest;
