import { Network } from "bitcoinjs-lib";
const bitcoin = require('bitcoinjs-lib')
import { RegtestUtils } from 'regtest-client';
import { TransactionInterface } from ".";
import { BlockResult } from ".";
const regtestUtils = new RegtestUtils(bitcoin)

export interface Unspent {
    value: number;
    txId: string;
    vout: number;
    address?: string;
    height?: number;
}

export class Regtest{
    url: string = 'https://blockstream.info/api';

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
}
