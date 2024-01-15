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
(async () => {
  // let provider = new Blockstream('https://blockstream.info/testnet/api');
  // let block = await provider.getBlockByHash('00000000000000127d470f3da2788b68b98dce30e955b542a63e4d156cabfd01');
  // console.log(block);
  // let tipHash = await provider.getTipHash();
  // console.log(tipHash);
  // let blocks = await provider.getBlocks(825877);
  // console.log(blocks);
  // let height = await provider.getBlockNumber();
  // console.log(height);
  // let block2 = await provider.getBlockByHeight(825877);
  // console.log(block2);
  // let address = await provider.getAddress('tb1q47u7f8ct64l6ew0jpdk6uvvtqa7y6fwnwarkpr');
  // console.log(address);
  // let tx = await provider.getTransaction('b21ba999c89477af16b2ae0cf2eca428d50a62ba82d97628428dd4b5d567e6f1')
  // console.log(tx);
  // not yet tested
  // let provider = new Blockchaincom();
  // let block = await provider.getBlockByHash('00000000000000000001c612debf7ab81f48566f325a37efe43ea0661cce5533');
  // console.log(block);
})();
