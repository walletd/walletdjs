import { ethers } from 'ethers';

// import "./providers/AlchemyProvider";
require('dotenv').config();

class EthClient {
    // Properties
    provider: ethers.AlchemyProvider;
    apiKey: string;
    wallet?: ethers.HDNodeWallet; 
    // endpoint: string;

    // Constructor
    constructor(apiKey: string) {
      // Alchemy API endpoint
        //this.endpoint = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
        // Create an ethers.js provider using Alchemy
        //const provider = new ethers.AlchemyProvider('goerli', apiKey);
        const provider = new ethers.AlchemyProvider('sepolia', apiKey);
        this.apiKey = apiKey;
        this.provider = provider;
    }

    async initialiseWalletFromPhrase(mnemonic: string) {
        // Create a wallet using the given mnemonic
        console.log("Mnemonic: " + mnemonic);
        let wallet = ethers.Wallet.fromPhrase(mnemonic);
        // Connect the wallet to the provider
        wallet = wallet.connect(this.provider);
        // Return the wallet
        this.wallet = wallet;
        return wallet;
    }

    // Default JSON-RPC methods - may not match ethers's supported functions

    // **TODO** : These are JSON-RPC commands
    //Returns the number of most recent block.
    async blockNumber() {
        let blockNumber = await this.provider.getBlockNumber();
        return blockNumber;
    }

    // **TODO** : These are JSON-RPC commands
    //Returns the balance of the account of a given address.
    async getBalance(address: string) {
        let balance = await this.provider.getBalance(address);
        return balance;
    }

    // **TODO** : These are JSON-RPC commands
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

    // **TODO** : These are JSON-RPC commands
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

    // **TODO** : These are JSON-RPC commands
    // Returns information about a block based on its hash.
    // Duplicates the getBlock function, but we want to stick as closely to the original JSON-RPC commands
    async getBlockByHash(hash: string) {
        let block = await this.provider.getBlock(hash);
        return block;
    }

    // **TODO** : These are JSON-RPC commands
    //Returns the information about a transaction requested by transaction hash.
    async getTransactionByHash(hash: string) {
        let transaction = await this.provider.getTransaction(hash);
        return transaction;
    }

    // **TODO** : These are JSON-RPC commands No equivalent in Alchemy
    //Returns information about a transaction by block hash and transaction index.
    async getTransactionByBlockHashAndIndex() {
        
    }

    // **TODO** : These are JSON-RPC commands 
    //Returns the receipt of a transaction by transaction hash.
    async getTransactionReceipt(transactionHash: string) {
        let transactionReceipt = await this.provider.getTransactionReceipt(transactionHash);
        return transactionReceipt;

    }

    async createRandomWallet() {
        let wallet = ethers.Wallet.createRandom();
        console.log(wallet);
        return wallet;
    }

    // **TODO** : These are JSON-RPC commands
    //Returns an array of all logs matching a given filter object.
    async getLogs() {

    }

    // **TODO** : These are JSON-RPC commands
    //Creates new message call transaction or a contract creation for signed transactions.
    async sendTransaction() {

    }
    
    // A method that returns a transaction so that fields can be specified before sending it 
    async prepareTransaction() {
        return new ethers.Transaction();
    }

    async gasPrice() {
        let price = await this.provider.getFeeData();
        return price;
    }

    // A non-rpc method designed for convenience
    async sendEther(toAddress: string, transactionData: string) {
        let sendTx = await ethClient.wallet.sendTransaction({
            to: "0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b",
            value: ethers.parseEther("0.00001")
        });
        return sendTx;        
    }

    // **TODO** : These are JSON-RPC commands
    //Sends a raw transaction.
    async sendRawTransaction() {

    } 

    // **TODO** : These are JSON-RPC commands
    //Executes a new message call immediately without creating a transaction on the blockchain.
    async call() {

    }

    // **TODO** : These are JSON-RPC commands
    //Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
    async estimateGas(transactionRequest: ethers.TransactionRequest) {
        
    }

    // **TODO** : These are JSON-RPC commands
    //Returns code at a given address.
    async getCode() {

    }

    // **TODO** : These are JSON-RPC commands
    //Returns a list of available compilers in the client.
    async getCompilers() {

    }

    // **TODO** : These are JSON-RPC commands
    //Returns compiled code of a Solidity smart contract.
    async compileSolidity() {

    }

    // **TODO** : These are JSON-RPC commands
    //Returns compiled code of an LLL program.
    async compileLLL() {

    }

    // **TODO** : These are JSON-RPC commands 
    //Returns compiled code of a Serpent program.
    async compileSerpent() {

    }
}


export enum Providers {
    Alchemy,
    Infura,
    JsonRpc
}

async function doStuff() {
    let phrase = process.env.MNEMONIC;
    let ethClient = new EthClient("VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT");
    

    let transaction = await ethClient.prepareTransaction();
    transaction.to = "0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b";
    transaction.value = ethers.parseEther("0.00001");
    transaction.data = "0x00614d6a4c73366a6cd58354a2a3bc7cd400000000017678dadae1cff0c3678194d3c763aad7ea9476756c64089cec39db6b5f5dc2baeb972357e6b5ae6c5f685bd5ec1714b78035fc89b927db841d2b844daf4cbcbb69b55386b2da1dc17c7da1a2a556868c8b9c5a52d7c5fc3a003130526fd34e75079943af9f74d83f48e9d59d50adc81bd2dae89034f9d6da934b8c7b9afd82e217d4f6681da8d6a9324866fff8f1408fded28c798abb5ddbe7f7ed79f7e4941a4b9920c8c03f500319993eebae96374b7310cb100ef394d1bbd7f6aa5f35ffaccd150d998de5dca9738836f01fd440c31e4537736f8f188fab33effa7cfbf57fdbeccd4baf4bf3de0c11962f3bd2ba7f05b106c632400d142dbed23c8fb143374d7391e8ccdd3b7445fe726e8daefbe01134c5613b7bd94f11a20d64821a5893726796eacc336b667afdefe9bd752f4431fca0e39737391fc2eb5757312db7ca20da4016a881eadf7d67ce98d2177ef8d7e62747fec83c64e49cff436c6703c7922aeb6937368596106d20db0140000000ffff49670ff901";

    // Example fee calculation

    let fees = await ethClient.gasPrice();
    console.log(fees);

    const gasPrice = fees.gasPrice;  // Replace with your preferred gas price
    const gasPriceInGwei = ethers.parseUnits(gasPrice.toString(), 'gwei');

// const feeInWei = ethers.bigNumberify(gasPrice).mul(gasLimit);

console.log('Gas Price:', gasPriceInGwei, 'Gwei');
console.log('Gas Limit:', fees.maxFeePerGas);
console.log('Transaction Fee:', feeInEther, 'Ether');

const gasAmount = await ethClient.provider.estimateGas({
    // the same transaction parameters you would pass when sending a transaction
    to: "0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b",
    data: "0x00614d6a4c73366a6cd58354a2a3bc7cd400000000017678dadae1cff0c3678194d3c763aad7ea9476756c64089cec39db6b5f5dc2baeb972357e6b5ae6c5f685bd5ec1714b78035fc89b927db841d2b844daf4cbcbb69b55386b2da1dc17c7da1a2a556868c8b9c5a52d7c5fc3a003130526fd34e75079943af9f74d83f48e9d59d50adc81bd2dae89034f9d6da934b8c7b9afd82e217d4f6681da8d6a9324866fff8f1408fded28c798abb5ddbe7f7ed79f7e4941a4b9920c8c03f500319993eebae96374b7310cb100ef394d1bbd7f6aa5f35ffaccd150d998de5dca9738836f01fd440c31e4537736f8f188fab33effa7cfbf57fdbeccd4baf4bf3de0c11962f3bd2ba7f05b106c632400d142dbed23c8fb143374d7391e8ccdd3b7445fe726e8daefbe01134c5613b7bd94f11a20d64821a5893726796eacc336b667afdefe9bd752f4431fca0e39737391fc2eb5757312db7ca20da4016a881eadf7d67ce98d2177ef8d7e62747fec83c64e49cff436c6703c7922aeb6937368596106d20db0140000000ffff49670ff901",
    value: ethers.parseEther("0.1")
});

    console.log(`Gas amount needed: ${gasAmount} gwei`);
    let gasTotal = ethers.formatEther(gasAmount * gasPrice);
    console.log(`Total gas fee for transaction which is neeeded: ${gasTotal}`);
    let gasTotalInGwei = ethers.parseUnits(gasTotal, 'gwei');
    console.log(`Total estimated gas fee (gasamount * gasprice): ${gasTotalInGwei}`);
    // async prepareTransaction(toAddress: string, transactionData: string) {
    // let phrase = ""
    // let test = await ethClient.initialiseWalletFromPhrase(phrase);
    // console.log(ethClient);
    // let balance = await ethClient.getBalance(ethClient.wallet.address);
    // console.log(balance);   
    // let newWallet = await ethClient.createRandomWallet();
    // console.log(newWallet);
    let balance = await ethClient.getBalance("0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b");
    console.log(`Balance: ${balance}`);
    // let sendTx = await ethClient.wallet.sendTransaction({
    //     to: "0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b",
    //     value: ethers.parseEther("0.00001")
    // });
    // console.log(sendTx);
}

doStuff();

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

