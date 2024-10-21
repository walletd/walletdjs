"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSendGasLimitERC20 = exports.sendGasLimits = void 0;
const chains_1 = require("./chains");
const sendGasLimits = {
    BTC: 290,
    NATIVE_EVM: 21000, // EVM -> ETH, RBTC, MATIC, BNB, AVAX, FUSE
    ERC20_EVM: 90000, // EVM -> ETH, RBTC, MATIC, BNB, AVAX, FUSE
    SOL: 1000000000,
};
exports.sendGasLimits = sendGasLimits;
const getSendGasLimitERC20 = (chainId) => {
    if (!(0, chains_1.hasTokens)(chainId)) {
        throw new Error(`Chain '${chainId}' doesn't support tokens!`);
    }
    switch (chainId) {
        default:
            // EVM standard gas limit
            return sendGasLimits.ERC20_EVM;
    }
};
exports.getSendGasLimitERC20 = getSendGasLimitERC20;
