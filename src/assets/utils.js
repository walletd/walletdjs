"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyToUnit = exports.unitToCurrency = exports.remove0x = exports.ensure0x = void 0;
const bignumber_js_1 = require("bignumber.js");
/**
 * Appends 0x if missing from hex string
 */
function ensure0x(hash) {
    return hash.startsWith('0x') ? hash : `0x${hash}`;
}
exports.ensure0x = ensure0x;
/**
 * Removes 0x if it exists in hex string
 */
function remove0x(hash) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
}
exports.remove0x = remove0x;
function unitToCurrency(asset, value) {
    const multiplier = new bignumber_js_1.default(10).pow(asset.decimals);
    return new bignumber_js_1.default(value).dividedBy(multiplier);
}
exports.unitToCurrency = unitToCurrency;
function currencyToUnit(asset, value) {
    const multiplier = new bignumber_js_1.default(10).pow(asset.decimals);
    return new bignumber_js_1.default(value).times(multiplier);
}
exports.currencyToUnit = currencyToUnit;
