"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSolanaTx = exports.isValidSolanaAddress = exports.with0x = exports.toLowerCaseWithout0x = exports.isValidHexWithout0xPrefix = exports.isValidHexWith0xPrefix = void 0;
const isValidHexWith0xPrefix = (hash) => /^(0x)?([A-Fa-f0-9]{64})$/.test(hash);
exports.isValidHexWith0xPrefix = isValidHexWith0xPrefix;
const isValidHexWithout0xPrefix = (hash) => /^([A-Fa-f0-9]{64})$/.test(hash);
exports.isValidHexWithout0xPrefix = isValidHexWithout0xPrefix;
const toLowerCaseWithout0x = (hash) => hash.toLowerCase().replace(/0x/g, '');
exports.toLowerCaseWithout0x = toLowerCaseWithout0x;
const with0x = (hash) => hash.startsWith('0x') ? hash : '0x' + hash;
exports.with0x = with0x;
const isValidSolanaAddress = (address) => {
    return (typeof address === 'string' && address.length >= 32 && address.length <= 44);
};
exports.isValidSolanaAddress = isValidSolanaAddress;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isValidSolanaTx = (_tx) => {
    return true;
};
exports.isValidSolanaTx = isValidSolanaTx;
