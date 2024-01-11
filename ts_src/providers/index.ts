import {Blockstream} from './blockstream';
import { Blockchaincom } from './blockchaincom';

export { Blockstream, Blockchaincom };

export enum Providers {
    Blockstream,
    Blockchaincom
}
export interface Provider {
    getBlockByHash: (hash: string) => Promise<BlockResult>;
    getBlockNumber: () => Promise<number>;
}

export type BlockResult = {
    hash: string;
    ver: number;
    prev_block: String;
    mrkl_root: String;
    time: number;
    bits: number;
    nonce: number;
    n_tx: number;
    size: number;
    block_index: number;
    main_chain: boolean;
    height: number;
    recieved_time: number;
    relayed_by: string;
    //tx: Array<Transaction>;
  }