"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockstream = void 0;
class Blockstream {
    constructor(url) {
        this.url = 'https://blockstream.info/api';
        if (url !== undefined) {
            this.url = url;
        }
    }
    getTipHash() {
        return fetch(this.url + '/blocks/tip/hash')
            .then(response => response.text())
            .then(data => data);
    }
    getBlockNumber() {
        return fetch(this.url + '/blocks/tip/height')
            .then(response => response.text())
            .then(data => Number(data));
    }
    getBlocks(height) {
        return request(this.url + '/blocks/' + height)
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
                };
            });
        });
    }
    getBlockByHeight(height) {
        return fetch(this.url + '/block-height/' + height)
            .then(response => response.text())
            .then(data => data);
    }
    getBlockByHash(hash) {
        return request(this.url + '/block/' + hash)
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
            };
        });
    }
    getAddress(address) {
        return request(this.url + '/address/' + address);
    }
    getAddressTransactions(address) {
        return request(this.url + '/address/' + address + '/txs');
    }
    getTransaction(txid) {
        return request(this.url + '/tx/' + txid)
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
                        sequence: "" + vin.sequence
                    };
                }),
                outs: data.vout.map((vout) => {
                    return {
                        value: vout.value,
                        script: vout.scriptpubkey,
                        address: vout.scriptpubkey_address
                    };
                })
            };
        });
    }
    broadcast(txHex) {
        throw new Error("Method not implemented." + txHex);
    }
}
exports.Blockstream = Blockstream;
// https://www.newline.co/@bespoyasov/how-to-use-fetch-with-typescript--a81ac257
// Make the `request` function generic
// to specify the return data type:
function request(url, 
// `RequestInit` is a type for configuring 
// a `fetch` request. By default, an empty object.
config = {}
// This function is async, it will return a Promise:
) {
    // Inside, we call the `fetch` function with 
    // a URL and config given:
    return fetch(url, config)
        // When got a response call a `json` method on it
        .then((response) => response.json())
        // and return the result data.
        .then((data) => data);
    // We also can use some post-response
    // data-transformations in the last `then` clause.
}
