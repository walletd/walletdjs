import { EthereumWallet } from "./ethereum-wallet";
import { BitcoinWallet } from "./bitcoin-wallet";
import { BitcoinEsploraApiProvider } from "../bitcoin";
import {
  EvmWalletProvider,
  EvmChainProvider,
  EvmNetworks,
} from "@chainify/evm";
import { FileStorage } from "../storage";
import { WalletOptions, UTXO, TxStatus } from "./types";
import { BitcoinNetworks } from "@chainify/bitcoin";
import { BitcoinNetwork } from "@chainify/bitcoin/dist/lib/types";
export {
  EthereumWallet,
  EvmWalletProvider,
  BitcoinWallet,
  BitcoinEsploraApiProvider,
  EvmChainProvider,
  EvmNetworks,
  BitcoinNetworks,
  FileStorage,
  WalletOptions,
  UTXO,
  TxStatus,
};

export interface BitcoinNetworkProvider {
  url: string;
  network: BitcoinNetwork;
}

export interface IBitcoinNetworkProviders {
  blockstream_testnet: BitcoinNetworkProvider;
  blockstream: BitcoinNetworkProvider;
}
export const BitcoinNetworkProviders = {
  blockstream_testnet: {
    url: "https://blockstream.info/testnet/api/",
    network: BitcoinNetworks.bitcoin_testnet,
  },
  blockstream: {
    url: "https://blockstream.info/api/",
    network: BitcoinNetworks.bitcoin,
  },
};
