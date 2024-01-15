import { ethers } from 'ethers';

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
        this.getBlock();
    }
  

    // Method
    // initConnector(TProvider: string): void {
    //   console.log(`we are connecting to {provider}.`);
    // }

    async getBlockByNumber(number: number) {
        // const provider = new ethers.AlchemyProvider(undefined, "VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT");
        // const block = await provider.getBlock(hash);
        //console.log(block);
        let block = await this.provider.getBlock(19011632);
        console.log(block);
    }

    // Default JSON-RPC methods - may not match ethers's supported functions

    // **TODO** :
    //Returns the number of most recent block.
    async blockNumber() {

    }

    // **TODO** :
    //Returns the balance of the account of a given address.
    async getBalance() {

    }

    // **TODO** :
    //Returns the value from a storage position at a given address.
    async getStorageAt() {

    }

    // **TODO** :
    //Returns the number of transactions sent from an address.
    async getTransactionCount() {

    }

    // **TODO** :
    //Returns information about a block based on its hash.
    async getBlockByHash() {

    }

    // **TODO** :
    //Returns information about a block based on its number.
    async getBlockByNumber() {

    }

    // **TODO** :
    //Returns the information about a transaction requested by transaction hash.
    async getTransactionByHash() {

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
    async sendRawTransaction( {

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