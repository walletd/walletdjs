import { Network } from '@chainify/types';
import { Network as BitcoinJsLibNetwork } from 'bitcoinjs-lib';

export interface BitcoinNetwork extends Network, BitcoinJsLibNetwork {}
