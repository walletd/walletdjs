import { BitcoinNetworks } from '@chainify/bitcoin';

export const EvmProviderOptions = {
  ganache: {
    name: 'ganache',
    coinType: 'native',
    isTestnet: true,
    chainId: 1337,
    rpcUrl: 'HTTP://127.0.0.1:8545',
  },
  bnbTestnet: {
    name: 'bnbTestnet',
    coinType: 'native',
    isTestnet: true,
    chainId: 97,
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
  },
  bnb: {
    name: 'bnb',
    coinType: 'native',
    isTestnet: false,
    chainId: 56,
    rpcUrl: 'https://binance.llamarpc.com',
  },
};

export const BtcProviderOptions = {
  regtestBatch: {
    url: 'http://localhost:3002',
    batchUrl: 'http://localhost:5003',
    network: BitcoinNetworks.bitcoin_regtest,
  },
};
