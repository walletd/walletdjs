import { BlockResult, Provider, TransactionInterface } from ".";

type BlockstreamBlockResult = {
  id: String,
  height: number,
  version: number,
  timestamp: number,
  tx_count: number,
  size: number,
  weight: number,
  merkle_root: String,
  previousblockhash: String,
  mediantime: number,
  nonce: number,
  bits: number,
  difficulty: number
}

type AddressResult = {
    address: string,
    chain_stats: StatsResult,
    mempool_stats: StatsResult
}

type StatsResult = {
    funded_txo_count: number,
    funded_txo_sum: number,
    spent_txo_count: number,
    spent_txo_sum: number,
    tx_count: number,
}

export type TransactionResult = {
    txid: string,
    version: number,
    locktime: number,
    vin: Array<VinResult>,
    vout: Array<VoutResult>,
    size: number,
    weight: number,
    fee: number,
    status: StatusResult,
}

type StatusResult = {
    confirmed: boolean,
    block_height: number,
    block_hash: string,
    block_time: number
}

type VinResult = {
    txid: string,
    vout: number,
    prevout: VoutResult,
    scriptsig: string,
    scriptsig_asm: string,
    witness: Array<string>,
    is_coinbase: boolean,
    sequence: number
}

type VoutResult = {
    scriptpubkey: string,
    scriptpubkey_asm: string,
    scriptpubkey_type: string,
    scriptpubkey_address: string,
    value: number,
}

export class Blockstream implements Provider{
    url: string = 'https://blockstream.info/api';

    constructor(url?: string) {
        if (url !== undefined) {
            this.url = url;
        }
    }

    getTipHash(): Promise<string> {
        return fetch(this.url + '/blocks/tip/hash')
        .then(response => response.text())
        .then(data => data );
    }

    getBlockNumber(): Promise<number> {
        return fetch(this.url + '/blocks/tip/height')
        .then(response => response.text())
        .then(data => Number(data));
    }

    getBlocks(height: number): Promise<Array<BlockResult>> {
        return request<Array<BlockstreamBlockResult>>(this.url + '/blocks/' + height)
        .then(data => {
            return data.map((block) => {
                return {
                    hash: block.id,
                    ver: block.version,
                    prev_block: block.previousblockhash,
                    mrkl_root: block.merkle_root,
                    time: block.timestamp,
                    bits: block.bits,
                    nonce: block.nonce,
                    n_tx: block.tx_count,
                    size: block.size,
                    block_index: block.height,
                    main_chain: true,
                    height: block.height,
                    recieved_time: block.timestamp,
                    relayed_by: 'blockstream.info'
                } as BlockResult;
            })
        })
    }

    getBlockByHeight(height: number): Promise<string> {
        return fetch(this.url + '/block-height/' + height)
        .then(response => response.text())
        .then(data => data);
    }

    getBlockByHash(hash: string): Promise<BlockResult> {
        return request<BlockstreamBlockResult>(this.url + '/block/' + hash)
        .then((data) => {
            return {
                hash: data.id,
                ver: data.version,
                prev_block: data.previousblockhash,
                mrkl_root: data.merkle_root,
                time: data.timestamp,
                bits: data.bits,
                nonce: data.nonce,
                n_tx: data.tx_count,
                size: data.size,
                block_index: data.height,
                main_chain: true,
                height: data.height,
                recieved_time: data.timestamp,
                relayed_by: 'blockstream.info'
            } as BlockResult;
        });
    }

    getAddress(address: string): Promise<AddressResult> {
        return request<AddressResult>(this.url + '/address/' + address)
    }

    getAddressTransactions(address: string): Promise<Array<TransactionResult>> {
        return request<Array<TransactionResult>>(this.url + '/address/' + address + '/txs')
    }

    getTransaction(txid: string): Promise<TransactionInterface> {
        return request<TransactionResult>(this.url + '/tx/' + txid)
        .then((data) => {
            return {
                txId: data.txid,
                txHex: '',
                vsize: data.size,
                version: data.version,
                locktime: data.locktime,
                ins: data.vin.map((vin) => {
                    return {
                        txId: vin.txid,
                        vout: vin.vout,
                        script: vin.scriptsig,
                        sequence: ""+vin.sequence
                    }
                }),
                outs: data.vout.map((vout) => {
                    return {
                        value: vout.value,
                        script: vout.scriptpubkey,
                        address: vout.scriptpubkey_address
                    }
                })
            } as TransactionInterface;
        })
    }

    broadcast(txHex: string): Promise<null> {
        throw new Error("Method not implemented."+txHex);
    }
}
// https://www.newline.co/@bespoyasov/how-to-use-fetch-with-typescript--a81ac257
// Make the `request` function generic
// to specify the return data type:
function request<TResponse>(
    url: string,
    // `RequestInit` is a type for configuring 
    // a `fetch` request. By default, an empty object.
    config: RequestInit = {}
     
  // This function is async, it will return a Promise:
  ): Promise<TResponse> {
      
    // Inside, we call the `fetch` function with 
    // a URL and config given:
    return fetch(url, config)
      // When got a response call a `json` method on it
      .then((response) => response.json())
      // and return the result data.
      .then((data) => data as TResponse);
      
      // We also can use some post-response
      // data-transformations in the last `then` clause.
  }
  