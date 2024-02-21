import { BitcoinNetwork } from "@chainify/bitcoin/dist/lib/types"
import { Network } from '@chainify/types';

export interface WalletOptions {
    btc: {
        mnemonic: string,
        network: BitcoinNetwork,
        baseDerivationPath: string
    },
    eth: {
        mnemonic: string,
        derivationPath: string,
        network: Network
    }
}

export declare type TxStatus = {
    confirmed: boolean;
    block_hash?: string;
    block_height?: number;
    block_time?: number;
};
export declare type UTXO = {
    txid: string;
    vout: number;
    status: TxStatus;
    value: number;
    address?: string;
};