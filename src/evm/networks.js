"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmNetworks = void 0;
const ethereum_mainnet = {
    name: 'ethereum_mainnet',
    coinType: '60',
    networkId: 1,
    chainId: 1,
    isTestnet: false,
};
// const ganache: Network = {
//   name: 'Ganache-EVM',
//   coinType: '60',
//   isTestnet: true,
//   chainId: 1337, // Ganache
//   networkId: 1337,
//   rpcUrl: 'http://localhost:8545',
// };
const classic_mainnet = {
    name: 'classic_mainnet',
    coinType: '61',
    networkId: 1,
    chainId: 61,
    isTestnet: false,
};
const ropsten = {
    name: 'ropsten',
    coinType: '60',
    networkId: 3,
    chainId: 3,
    isTestnet: true,
};
const rinkeby = {
    name: 'rinkeby',
    coinType: '60',
    networkId: 4,
    chainId: 4,
    isTestnet: true,
};
const kovan = {
    name: 'kovan',
    coinType: '60',
    networkId: 42,
    chainId: 42,
    isTestnet: true,
};
const goerli = {
    name: 'goerli',
    coinType: '60',
    networkId: 5,
    chainId: 5,
    isTestnet: true,
};
const sepolia = {
    name: 'sepolia',
    coinType: '60',
    networkId: 11155111,
    chainId: 11155111,
    isTestnet: true,
};
const rsk_mainnet = {
    name: 'rsk_mainnet',
    coinType: '60',
    networkId: 30,
    chainId: 30,
    isTestnet: false,
};
const rsk_testnet = {
    name: 'rsk_testnet',
    coinType: '60',
    networkId: 31,
    chainId: 31,
    isTestnet: true,
};
const rsk_regtest = {
    name: 'rsk_regtest',
    coinType: '37310',
    networkId: 33,
    chainId: 33,
    isTestnet: true,
};
const bsc_mainnet = {
    name: 'bsc_mainnet',
    coinType: '60',
    networkId: 56,
    chainId: 56,
    isTestnet: false,
};
const bsc_testnet = {
    name: 'bsc_testnet',
    coinType: '60',
    networkId: 97,
    chainId: 97,
    isTestnet: true,
};
const polygon_mainnet = {
    name: 'polygon_mainnet',
    coinType: '60',
    networkId: 137,
    chainId: 137,
    isTestnet: false,
};
const polygon_testnet = {
    name: 'polygon_testnet',
    coinType: '60',
    networkId: 80001,
    chainId: 80001,
    isTestnet: true,
};
const arbitrum_mainnet = {
    name: 'arbitrum_mainnet',
    coinType: '60',
    networkId: 42161,
    chainId: 42161,
    isTestnet: false,
};
const arbitrum_testnet = {
    name: 'arbitrum_testnet',
    coinType: '60',
    networkId: 421611,
    chainId: 421611,
    isTestnet: true,
};
const fuse_mainnet = {
    name: 'fuse_mainnet',
    coinType: '60',
    networkId: 122,
    chainId: 122,
    isTestnet: false,
};
const fuse_testnet = {
    name: 'fuse_testnet',
    coinType: '60',
    networkId: 122,
    chainId: 122,
    isTestnet: true,
};
const avax_mainnet = {
    name: 'avalanche_mainnet',
    coinType: '60',
    networkId: 43114,
    chainId: 43114,
    isTestnet: false,
};
const avax_testnet = {
    name: 'avalanche_testnet',
    coinType: '60',
    networkId: 43113,
    chainId: 43113,
    isTestnet: true,
};
const optimism_mainnet = {
    name: 'optimism_mainnet',
    coinType: '60',
    networkId: 10,
    chainId: 10,
    isTestnet: false,
};
const optimism_testnet = {
    name: 'optimism_testnet',
    coinType: '60',
    networkId: 69,
    chainId: 69,
    isTestnet: true,
};
const local = {
    name: 'local',
    coinType: '60',
    networkId: 1337,
    chainId: 1337,
    isTestnet: true,
};
const EvmNetworks = {
    ethereum_mainnet,
    classic_mainnet,
    ganache,
    ropsten,
    rinkeby,
    kovan,
    goerli,
    sepolia,
    rsk_mainnet,
    rsk_testnet,
    rsk_regtest,
    bsc_mainnet,
    bsc_testnet,
    polygon_mainnet,
    polygon_testnet,
    arbitrum_testnet,
    arbitrum_mainnet,
    avax_mainnet,
    avax_testnet,
    fuse_testnet,
    fuse_mainnet,
    optimism_mainnet,
    optimism_testnet,
    local,
};
exports.EvmNetworks = EvmNetworks;
