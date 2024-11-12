import { type Network } from '@chainify/types';
import { type Network as BitcoinJsLibNetwork } from 'bitcoinjs-lib';

export interface BitcoinNetwork extends Network, BitcoinJsLibNetwork {}
