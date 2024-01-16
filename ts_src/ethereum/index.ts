import { Block, ethers } from 'ethers';

class EthClient {
    // Properties
    provider: ethers.AlchemyProvider;
    apiKey: string;
    // endpoint: string;

    // Constructor
    constructor(apiKey: string) {
      // Alchemy API endpoint
        //this.endpoint = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
        // Create an ethers.js provider using Alchemy
        const provider = new ethers.AlchemyProvider(undefined, apiKey);
        console.log(provider);
        this.apiKey = apiKey;
        this.provider = provider;
        let block = this.getBlockByNumber(19011632);
        console.log(block);
    }

    // Default JSON-RPC methods - may not match ethers's supported functions

    // **TODO** :
    //Returns the number of most recent block.
    async blockNumber() {
        let blockNumber = await this.provider.getBlockNumber();
        return blockNumber;
    }

    // **TODO** :
    //Returns the balance of the account of a given address.
    async getBalance(address: string) {
        let balance = await this.provider.getBalance(address);
        return balance;
    }

    // **TODO** :
    //Returns the value from a storage position at a given address.
    // address: Address to get storage from
    // slotPosition: The position in the storage to get the value from (in hex)
    // Either the hex value of a block number OR a block hash OR One of the following block tags:
    // - pending - A sample next block built by the client on top of latest and containing the set of transactions usually taken from local mempool. Intuitively, you can think of these as blocks that have not been mined yet.
    // - latest - The most recent block in the canonical chain observed by the client, this block may be re-orged out of the canonical chain even under healthy/normal conditions.
    // - safe - The most recent crypto-economically secure block, cannot be re-orged outside of manual intervention driven by community coordination. Intuitively, this block is “unlikely” to be re-orged.
    // - finalized - The most recent crypto-economically secure block, that has been accepted by >2/3 of validators. Cannot be re-orged outside of manual intervention driven by community coordination. Intuitively, this block is very unlikely to be re-orged.
    // - earliest - The lowest numbered block the client has available. Intuitively, you can think of this as the first block created.
    async getStorageAt(address: string, slotPosition: string, blockTagOrNumberOrHash?: string) {
        let storage = await this.provider.getStorage(address, slotPosition, blockTagOrNumberOrHash);
        return storage;
    }

    // **TODO** :
    // Returns the number of transactions sent from an address.
    async getTransactionCount(address: string, blockTagOrNumberOrHash?: string) {
        let transactionCount = await this.provider.getTransactionCount(address, blockTagOrNumberOrHash);
        return transactionCount;
    }

    // Returns a Block by its number
    // Duplicates the getBlock function, but we want to stick as closely to the original JSON-RPC commands
    async getBlockByNumber(number: number) {
        let block = await this.provider.getBlock(number);
        return block;
    }

    // **TODO** :
    // Returns information about a block based on its hash.
    // Duplicates the getBlock function, but we want to stick as closely to the original JSON-RPC commands
    async getBlockByHash(hash: string) {
        let block = await this.provider.getBlock(hash);
        return block;
    }

    // **TODO** :
    //Returns the information about a transaction requested by transaction hash.
    async getTransactionByHash(hash: string) {
        let transaction = await this.provider.getTransaction(hash);
        return transaction;
    }

    // **TODO** :
    //Returns information about a transaction by block hash and transaction index.
    async getTransactionByBlockHashAndIndex() {

    }

    // **TODO** :
    //Returns information about a transaction by block number and transaction index.
    async getTransactionByBlockNumberAndIndex() {

    }

    // **TODO** :
    //Returns the receipt of a transaction by transaction hash.
    async getTransactionReceipt() {

    }

    // **TODO** :
    //Returns an array of all logs matching a given filter object.
    async getLogs() {

    }

    // **TODO** :
    //Creates new message call transaction or a contract creation for signed transactions.
    async sendTransaction() {

    }

    // **TODO** :
    //Sends a raw transaction.
    async sendRawTransaction() {

    } 

    // **TODO** :
    //Executes a new message call immediately without creating a transaction on the blockchain.
    async call() {

    }

    // **TODO** :
    //Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
    async estimateGas() {

    }

    // **TODO** :
    //Returns code at a given address.
    async getCode() {

    }

    // **TODO** :
    //Returns a list of available compilers in the client.
    async getCompilers() {

    }

    // **TODO** :
    //Returns compiled code of a Solidity smart contract.
    async compileSolidity() {

    }

    // **TODO** :
    //Returns compiled code of an LLL program.
    async compileLLL() {

    }

    // **TODO** :
    //Returns compiled code of a Serpent program.
    async compileSerpent() {

    }
}


export enum Providers {
    Alchemy,
    Infura
}

console.log("Check this out");

let ethClient = new EthClient("VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT");
console.log(ethClient);

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

/* List of JSON-RPC methods

async blockNumber(): Returns the number of most recent block.
async getBalance(): Returns the balance of the account of a given address.
async getStorageAt(): Returns the value from a storage position at a given address.
async getTransactionCount(): Returns the number of transactions sent from an address.
async getBlockByHash(): Returns information about a block based on its hash.
async getBlockByNumber(): Returns information about a block based on its number.
async getTransactionByHash(): Returns the information about a transaction requested by transaction hash.
async getTransactionByBlockHashAndIndex(): Returns information about a transaction by block hash and transaction index.
async getTransactionByBlockNumberAndIndex(): Returns information about a transaction by block number and transaction index.
async getTransactionReceipt(): Returns the receipt of a transaction by transaction hash.
async getLogs(): Returns an array of all logs matching a given filter object.
async sendTransaction(): Creates new message call transaction or a contract creation for signed transactions.
async sendRawTransaction(): Sends a raw transaction.
async call(): Executes a new message call immediately without creating a transaction on the blockchain.
async estimateGas(): Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
async getCode(): Returns code at a given address.
async getCompilers(): Returns a list of available compilers in the client.
async compileSolidity(): Returns compiled code of a Solidity smart contract.
async compileLLL(): Returns compiled code of an LLL program.
async compileSerpent(): Returns compiled code of a Serpent program.

*/