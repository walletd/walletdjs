"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = exports.Blockchaincom = exports.Blockstream = void 0;
const blockstream_1 = require("./blockstream");
Object.defineProperty(exports, "Blockstream", {
  enumerable: true,
  get: function () {
    return blockstream_1.Blockstream;
  },
});
const blockchaincom_1 = require("./blockchaincom");
Object.defineProperty(exports, "Blockchaincom", {
  enumerable: true,
  get: function () {
    return blockchaincom_1.Blockchaincom;
  },
});
var Providers;
(function (Providers) {
  Providers[(Providers["Blockstream"] = 0)] = "Blockstream";
  Providers[(Providers["Blockchaincom"] = 1)] = "Blockchaincom";
})(Providers || (exports.Providers = Providers = {}));
