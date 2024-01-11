"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockstream = void 0;
class Blockstream {
  getTipHash() {
    return fetch("https://blockstream.info/api/blocks/tip/hash")
      .then((response) => response.json())
      .then((data) => data.hash);
  }
  getTipHeight() {
    return fetch("https://blockstream.info/api/blocks/tip/height")
      .then((response) => response.json())
      .then((data) => data.height);
  }
  getBlocks(height) {
    return request("https://blockstream.info/api/blocks/" + height);
  }
  getBlockByHeight(height) {
    return request("https://blockstream.info/api/block-height/" + height);
  }
  getBlockByHash(hash) {
    return request("https://blockstream.info/api/block/" + hash);
  }
}
exports.Blockstream = Blockstream;
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
