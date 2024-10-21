"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = exports.getDerivationPath = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const getDerivationPath = (chainId, coinType, index) => {
    switch (chainId) {
        case cryptoassets_1.ChainId.Bitcoin:
            return `m/84'/${coinType}'/${index}'`;
        case cryptoassets_1.ChainId.Ethereum:
            return `m/44'/${coinType}'/0'/0/${index}`;
        case cryptoassets_1.ChainId.BinanceSmartChain:
            return `m/44'/${coinType}'/0'/0/${index}`;
        case cryptoassets_1.ChainId.Polygon:
            return `m/44'/${coinType}'/0'/0/${index}`;
        case cryptoassets_1.ChainId.Solana:
            return `m/44'/${coinType}'/0'/0'`;
        default:
            return `m/44'/${coinType}'/0'/0/${index}`;
    }
};
exports.getDerivationPath = getDerivationPath;
const createAccount = (network, chainId, index) => {
    const chainDetails = (0, cryptoassets_1.getChain)(network, chainId);
    const derivationPath = (0, exports.getDerivationPath)(chainId, chainDetails.network.coinType, index);
    return {
        type: 'default',
        name: chainDetails.name,
        chain: chainId,
        index: index,
        derivationPath: derivationPath,
        addresses: [],
        assets: chainDetails.nativeAsset,
        balances: {},
        color: chainDetails.color,
        enabled: true,
        createdAt: Date.now(),
        asset: chainDetails.nativeAsset[0],
        clientSettings: undefined,
    };
};
exports.createAccount = createAccount;
