import { AlchemyProvider, Block, FeeData, FixedNumber, HDNodeWallet, Log, ethers, Transaction, TransactionResponse, Filter, Wallet } from 'ethers';

require('dotenv').config();

class EthClient {
    // Properties
    provider: AlchemyProvider;
    apiKey: string;
    wallet?: HDNodeWallet; 
    // endpoint: string;

    // Constructor
    // Presently only supports Alchemy
    // To-do: Allow specification of providers (Alchemy, Infura, etc.)
    constructor(apiKey: string, networkId: number = 1, chainId: number = 1) {
        
        // Initialise an ethers.js provider using Alchemy
        const provider = new AlchemyProvider('sepolia', apiKey);
        this.apiKey = apiKey;
        this.provider = provider;
    }

    // Non-RPC
    // TODO: Change to use keystore
    initialiseWalletFromPhrase(mnemonic: string): void {
        // Create a wallet using the given mnemonic
        let wallet = Wallet.fromPhrase(mnemonic);
        // Connect the wallet to the provider
        wallet = wallet.connect(this.provider);
        // Return the wallet
        this.wallet = wallet;
    }

    // Default JSON-RPC methods - may not match ethers.js's supported functions

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns the number of most recent block.
    async blockNumber(): Promise<number> {
        let blockNumber = await this.provider.getBlockNumber();
        return blockNumber;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    //Returns the balance of the account of a given address.
    async getBalance(address: string): Promise<bigint> {
        let balance = await this.provider.getBalance(address);
        return balance;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns the value from a storage position at a given address.
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

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns the number of transactions sent from an address.
    async getTransactionCount(address: string, blockTagOrNumberOrHash?: string): Promise<number> {
        let transactionCount: number = await this.provider.getTransactionCount(address, blockTagOrNumberOrHash);
        return transactionCount;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Duplicates the getBlock function, but we want to stick as closely to the original JSON-RPC commands
    async getBlockByNumber(number: number): Promise<Block | null> {
        let block = await this.provider.getBlock(number);
        return block;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns information about a block based on its hash.
    // Duplicates the getBlock function, but we want to stick as closely to the original JSON-RPC commands
    async getBlockByHash(hash: string): Promise<Block | null> {
        let block = await this.provider.getBlock(hash);
        return block;
    }

    // Official JSON-RPC commands supported by Ethereum nodes - No equivalent in ethers
    //Returns the information about a transaction requested by transaction hash.
    async getTransactionByHash(hash: string): Promise<TransactionResponse | null>{
        let transaction = await this.provider.getTransaction(hash);
        return transaction;
    }

    // Official JSON-RPC commands supported by Ethereum nodes - No equivalent in Alchemy
    // Returns information about a transaction by block hash and transaction index.
    // async getTransactionByBlockHashAndIndex(hash: string, index: number): Promise<Transaction | null> {
    async getTransactionByBlockHashAndIndex(hash: string, index: number) {
        // Cannot implement using standard ethers.js provider
        let block = await this.getBlockByHash(hash);
        if (block == null) {
            return null;
        }
        let transaction = block.transactions[index];
        return transaction;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns the receipt of a transaction by transaction hash.
    async getTransactionReceipt(transactionHash: string) {
        let transactionReceipt = await this.provider.getTransactionReceipt(transactionHash);
        return transactionReceipt;
    }

    // Non JSON-RPC method
    // TODO: Refactor when we consolidate the keystore
    async createNewWallet() {
        let wallet = Wallet.createRandom();
        console.log(wallet);
        return wallet;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns an array of all logs matching a given filter object.
    async getLogs(filter: Filter): Promise<Array<Log>> {
        let logs = await this.provider.getLogs(filter);
        return logs;
    }

    // TO-DO: Finish - Official JSON-RPC commands supported by Ethereum nodes
    // Creates new message call transaction or a contract creation for signed transactions.
    async sendTransaction(tx: Transaction) {
        // We may need to sign the transaction before sending it
    }
    
    // A method that returns a transaction so that fields can be specified before sending it 
    prepareTransaction() {
        return new Transaction();
    }

    // Non-rpc method
    // Returns the fee data for the current network
    async feeData(): Promise<FeeData> {
        let fees = await this.provider.getFeeData();
        return fees;
    }


    // A non-rpc method designed for convenience
    // Sends a transaction to the given address with the given Ethereum value
    async sendEther(toAddress: string, ethereumValue: string): Promise<TransactionResponse | Error> {
        let tx: Transaction = new Transaction();
        tx.to = toAddress;
        tx.value = ethers.parseEther(ethereumValue);

        if (this.wallet == undefined) {
            return Error("Wallet not initialised");
        }

        let sendTx = await this.wallet.sendTransaction(tx);
        return sendTx;        
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    //Sends a raw transaction.
    // async sendRawTransaction() {

    // } 

    // Official JSON-RPC commands supported by Ethereum nodes
    //Executes a new message call immediately without creating a transaction on the blockchain.
    // async call() {

    // }

    // Non-JSON-RPC command
    // Generates and returns an estimate of how much gas (in gwei units) is necessary to fund the completion of the transaction.
    async estimateGweiFee(transaction: Transaction): Promise<FixedNumber> {
        const totalGas = await this.provider.estimateGas(transaction);
        const totalGasFixedNumber = FixedNumber.fromValue(totalGas);
        const divisor: FixedNumber = FixedNumber.fromValue(1000);
        const gwei = totalGasFixedNumber.div(divisor);
        return gwei;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns code at a given address.
    async getCode(address: string, blockTagOrNumberOrHash?: string): Promise<string> {
        let code = await this.provider.getCode(address, blockTagOrNumberOrHash);
        return code;
    }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns a list of available compilers in the client.
    // async getCompilers() {

    // }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns compiled code of a Solidity smart contract.
    // async compileSolidity() {

    // }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns compiled code of an LLL program.
    // async compileLLL() {

    // }

    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns compiled code of a Serpent program.
    // async compileSerpent() {

    // }
}


export enum Providers {
    Alchemy,
    Infura,
    JsonRpc
}

async function doStuff() {
    let ethClient = new EthClient("VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT");
    
    let envPhrase = process.env.MNEMONIC;
    if (typeof(envPhrase) == undefined) {
        console.log("Mnemonic not found in environment variables");
    } else {
        let phrase = envPhrase as string;
        await ethClient.initialiseWalletFromPhrase(phrase);
    }

    let transaction = ethClient.prepareTransaction();    

    // const gasFee = fees.gasPrice;  // Replace with your preferred gas price
    // const gasPriceInGwei = ethers.parseUnits(gasPrice.toString(), 'gwei');

    let gasTotal = await ethClient.estimateGweiFee(transaction);
    //let gwei = ethers.formatUnits(gasTotal, 'gwei');
    console.log(gasTotal + " ");
    // const feeInWei = ethers.bigNumberify(gasPrice).mul(gasLimit);

    // console.log('Gas Price:', gasPriceInGwei, 'Gwei');
    // console.log('Gas Limit:', fees.maxFeePerGas);
    // console.log('Transaction Fee:', feeInEther, 'Ether');

    //console.log(`Gas amount needed: ${gasAmount} gwei`);
    //let gasTotal = ethers.formatEther(gasAmount * gasPrice);
    //console.log(`Total gas fee for transaction which is neeeded: ${gasTotal}`);
    //let gasTotalInGwei = ethers.parseUnits(gasTotal, 'gwei');
    //console.log(`Total estimated gas fee (gasamount * gasprice): ${gasTotalInGwei}`);
    // async prepareTransaction(toAddress: string, transactionData: string) {
    // let phrase = ""
    // console.log(ethClient);
    // let balance = await ethClient.getBalance(ethClient.wallet.address);
    // console.log(balance);   
    // let newWallet = await ethClient.createRandomWallet();
    // console.log(newWallet);
    let balance = await ethClient.getBalance("0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b");
    console.log(`Balance: ${balance}`);
    let sendTx = await ethClient.sendEther(
        '0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b',
        "0.00001"
    );
    console.log("Type:" + typeof(sendTx) + " " + sendTx);
}

doStuff();

export default EthClient;

/* List of Ethereum JSON-RPC methods

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

