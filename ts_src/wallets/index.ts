import { HDWallet, CoinTypes } from './hd-wallet';
import { WalletManager } from './wallet-manager';

export { HDWallet, WalletManager, CoinTypes };

export interface BaseWallet {
    address(_index?: number) : string;
}