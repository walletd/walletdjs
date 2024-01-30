import { Network } from "bitcoinjs-lib";
const bitcoin = require('bitcoinjs-lib')
import { RegtestUtils } from 'regtest-client';
import { TransactionInterface } from ".";
import { BlockResult } from ".";
const fetch = require('node-fetch');
const regtestUtils = new RegtestUtils(bitcoin)

export interface Unspent {
    value: number;
    txId: string;
    vout: number;
    address?: string;
    height?: number;
}

export class Regtest{
    url: string = 'http://127.0.0.1:8080/1';

    constructor(url?: string) {
        if (url !== undefined) {
            this.url = url;
        } 
    }

    network(): Network {
        return regtestUtils.network
    }

    mineBlocks(n: number): Promise<string[]> {
        return regtestUtils.mine(n)
    }

    faucet(address: string, amount: number): Promise<Unspent> {
        return regtestUtils.faucet(address, amount)
    }

    verify(txo: Unspent): Promise<void> {
        return regtestUtils.verify(txo)
    }

    broadcast(txHex: string): Promise<null> {
        return regtestUtils.broadcast(txHex)
    }

    getBlockByHash(hash: string): Promise<BlockResult> {
        throw new Error("Method not implemented."+hash);
    }
    getBlockNumber(): Promise<number> {
        throw new Error("Method not implemented.");
    }

    getTransaction(txId: string): Promise<TransactionInterface> {
        return regtestUtils.fetch(txId)
    }

    async getTransactions(address: string): Promise<void> {
        const response = await fetch(this.url + '/a/'+address+'/txs', {
            method: 'GET',
          });
          console.log( await response.json())
        //   return response.json();
    }
    
    async height(): Promise<number> {
        const response = await fetch(this.url + '/b/best/height', {
          method: 'GET',
        });
        return response.json() as Promise<number>;
    }
}
