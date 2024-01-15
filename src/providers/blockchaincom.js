"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchaincom = void 0;
class Blockchaincom {
  getBlockByHash(hash) {
    return request("https://blockchain.info/rawblock/" + hash);
  }
  getBlocks() {
    return request("https://blockchain.info/blocks?format=json");
  }
  getBlockNumber() {
    return fetch("https://blockchain.info/latestblock")
      .then((response) => response.json())
      .then((data) => data.height);
  }
}
exports.Blockchaincom = Blockchaincom;
// https://www.newline.co/@bespoyasov/how-to-use-fetch-with-typescript--a81ac257
// Make the `request` function generic
// to specify the return data type:
function request(
  url,
  // `RequestInit` is a type for configuring
  // a `fetch` request. By default, an empty object.
  config = {},
  // This function is async, it will return a Promise:
) {
  // Inside, we call the `fetch` function with
  // a URL and config given:
  return (
    fetch(url, config)
      // When got a response call a `json` method on it
      .then((response) => response.json())
      // and return the result data.
      .then((data) => data)
  );
  // We also can use some post-response
  // data-transformations in the last `then` clause.
}
