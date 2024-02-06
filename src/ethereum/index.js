"use strict";
// TODO: Discuss pros/cons of moving providers into in eth-client instead. 
// We can do this when we polish up. This is more a to-do that can come when we polish
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthClient = exports.InfuraProvider = exports.AlchemyProvider = exports.JsonRpcProvider = void 0;
const ethers_1 = require("ethers");
Object.defineProperty(exports, "JsonRpcProvider", { enumerable: true, get: function () { return ethers_1.JsonRpcProvider; } });
Object.defineProperty(exports, "AlchemyProvider", { enumerable: true, get: function () { return ethers_1.AlchemyProvider; } });
Object.defineProperty(exports, "InfuraProvider", { enumerable: true, get: function () { return ethers_1.InfuraProvider; } });
const eth_client_1 = require("./eth-client");
Object.defineProperty(exports, "EthClient", { enumerable: true, get: function () { return eth_client_1.EthClient; } });
