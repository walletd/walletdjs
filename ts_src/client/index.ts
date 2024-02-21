import { EthereumWallet } from './ethereum-wallet';
import { BitcoinWallet } from './bitcoin-wallet';
import { BitcoinEsploraApiProvider } from '../bitcoin';
import { EvmWalletProvider, EvmChainProvider, EvmNetworks } from '@chainify/evm';
import { FileStorage } from '../storage';
import { WalletOptions, UTXO, TxStatus } from './types';
import { BitcoinNetworks } from '@chainify/bitcoin'
export { EthereumWallet, EvmWalletProvider, BitcoinWallet, BitcoinEsploraApiProvider, EvmChainProvider, EvmNetworks, BitcoinNetworks, FileStorage, WalletOptions, UTXO, TxStatus}

export const BitcoinNetworkProviders = {
    blockstream_testnet: {
        url: 'https://blockstream.info/testnet/api/', 
        network: BitcoinNetworks.bitcoin_testnet
    }
}