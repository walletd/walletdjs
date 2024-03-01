import { Blockstream, TransactionResult } from "./blockstream";

export { Blockstream, TransactionResult };

export enum Providers {
  Blockstream,
  RegTest,
}
export interface Provider {
  getBlockByHash: (hash: string) => Promise<BlockResult>;
  getBlockNumber: () => Promise<number>;
  getTransaction: (hash: string) => Promise<TransactionInterface>;
  broadcast: (txHex: string) => Promise<null>;
}

export interface Input {
  txId: string;
  vout: number;
  script: string;
  sequence: string;
}

export interface Output {
  value: number;
  script: string;
  address?: string;
}

export interface TransactionInterface {
  txId: string;
  txHex: string;
  vsize: number;
  version: number;
  locktime: number;
  ins: Input[];
  outs: Output[];
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
};

(async () => {
  // let provider = new Blockstream('https://blockstream.info/testnet/api');
  // let block = await provider.getBlockByHash('00000000000000127d470f3da2788b68b98dce30e955b542a63e4d156cabfd01');
  // console.log(block);
  // let tipHash = await provider.getTipHash();
  // console.log(tipHash);
  // let blocks = await provider.getBlocks(825877);
  // console.log(blocks);
  // let height = await provider.getBlockNumber();
  // console.log(height);
  // let block2 = await provider.getBlockByHeight(825877);
  // console.log(block2);
  // let address = await provider.getAddress('tb1q47u7f8ct64l6ew0jpdk6uvvtqa7y6fwnwarkpr');
  // console.log(address);
  // let tx = await provider.getTransaction('67a8b0c0e5810bdfe1981e238dee0564ab4322d53169174c0f514f570c7442d8')
  // console.log(tx);
  // not yet tested
  // let provider = new Blockchaincom();
  // let block = await provider.getBlockByHash('00000000000000000001c612debf7ab81f48566f325a37efe43ea0661cce5533');
  // console.log(block);
})();
