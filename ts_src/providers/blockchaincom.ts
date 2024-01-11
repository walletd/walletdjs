import { BlockResult, Provider } from ".";

export class Blockchaincom implements Provider {
    getBlockByHash(hash: string): Promise<BlockResult> {
        return request<BlockResult>('https://blockchain.info/rawblock/' + hash)
    }

    getBlocks(): Promise<Array<BlockResult>> {
        return request<Array<BlockResult>>('https://blockchain.info/blocks?format=json')
    }

    getBlockNumber(): Promise<number> {
        return fetch('https://blockchain.info/latestblock')
        .then(response => response.json())
        .then(data => data.height);
    }
}
// https://www.newline.co/@bespoyasov/how-to-use-fetch-with-typescript--a81ac257
// Make the `request` function generic
// to specify the return data type:
function request<TResponse>(
    url: string,
    // `RequestInit` is a type for configuring 
    // a `fetch` request. By default, an empty object.
    config: RequestInit = {}
     
  // This function is async, it will return a Promise:
  ): Promise<TResponse> {
      
    // Inside, we call the `fetch` function with 
    // a URL and config given:
    return fetch(url, config)
      // When got a response call a `json` method on it
      .then((response) => response.json())
      // and return the result data.
      .then((data) => data as TResponse);
      
      // We also can use some post-response
      // data-transformations in the last `then` clause.
  }
  