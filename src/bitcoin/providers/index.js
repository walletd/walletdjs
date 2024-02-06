"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = exports.Blockstream = void 0;
const blockstream_1 = require("./blockstream");
Object.defineProperty(exports, "Blockstream", { enumerable: true, get: function () { return blockstream_1.Blockstream; } });
var Providers;
(function (Providers) {
    Providers[Providers["Blockstream"] = 0] = "Blockstream";
    Providers[Providers["RegTest"] = 1] = "RegTest";
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
    // let tx = await provider.getTransaction('67a8b0c0e5810bdfe1981e238dee0564ab4322d53169174c0f514f570c7442d8')
    // console.log(tx);
    // not yet tested
    // let provider = new Blockchaincom();
    // let block = await provider.getBlockByHash('00000000000000000001c612debf7ab81f48566f325a37efe43ea0661cce5533');
    // console.log(block);
})();
