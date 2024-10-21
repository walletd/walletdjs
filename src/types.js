"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainId = exports.AssetTypes = void 0;
var AssetTypes;
(function (AssetTypes) {
    AssetTypes["native"] = "native";
    AssetTypes["erc20"] = "erc20";
})(AssetTypes || (exports.AssetTypes = AssetTypes = {}));
var ChainId;
(function (ChainId) {
    ChainId["Bitcoin"] = "bitcoin";
    ChainId["Ethereum"] = "ethereum";
    ChainId["Solana"] = "solana";
})(ChainId || (exports.ChainId = ChainId = {}));
