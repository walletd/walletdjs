import { Address } from "@chainify/types";
import { HDWallet, CoinTypes } from "./hd-wallet";
import { WalletManager } from "./wallet-manager";

export { HDWallet, WalletManager, CoinTypes };

export interface BaseWallet {
  provider?: any;
  getAddress() : Promise<Address>
  getAddresses(start: number, end: number): Promise<Address[]>;
}
