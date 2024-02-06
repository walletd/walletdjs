"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = exports.EthClient = exports.InfuraProvider = exports.AlchemyProvider = exports.JsonRpcProvider = void 0;
// Ethers lets you import just the classes you need. 
// We import the various pieces of ethers.js that we require.
// This is done so we don't need to qualify them by prefixing ethers, eg ethers.Transaction
const ethers_1 = require("ethers");
Object.defineProperty(exports, "JsonRpcProvider", { enumerable: true, get: function () { return ethers_1.JsonRpcProvider; } });
Object.defineProperty(exports, "AlchemyProvider", { enumerable: true, get: function () { return ethers_1.AlchemyProvider; } });
Object.defineProperty(exports, "InfuraProvider", { enumerable: true, get: function () { return ethers_1.InfuraProvider; } });
class EthClient {
    // endpoint: string;
    constructor(wallet, provider) {
        this.wallet = wallet;
        this.provider = provider;
    }
    // Non-RPC
    // TODO: Change to use keystore
    static fromPhrase(mnemonic, provider, path) {
        // Create a wallet using the given mnemonic
        let wallet = ethers_1.HDNodeWallet.fromPhrase(mnemonic, '', path);
        if (provider !== undefined) {
            // Connect the wallet to the provider
            wallet = wallet.connect(provider);
        }
        // Return the wallet
        let client = new EthClient(wallet, provider);
        return client;
    }
    connect(provider) {
        this.provider = provider;
        this.wallet = this.wallet.connect(provider);
    }
    address() {
        return this.wallet?.address ?? '';
    }
    // Default JSON-RPC methods - may not match ethers.js's supported functions
    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns the number of most recent block.
    async blockNumber() {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let blockNumber = await this.provider.getBlockNumber();
        return blockNumber;
    }
    // Official JSON-RPC commands supported by Ethereum nodes
    //Returns the balance of the account of a given address.
    async getBalance() {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let balance = await this.provider.getBalance(this.address());
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
    async getStorageAt(address, slotPosition, blockTagOrNumberOrHash) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let storage = await this.provider.getStorage(address, slotPosition, blockTagOrNumberOrHash);
        return storage;
    }
    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns the number of transactions sent from an address.
    async getTransactionCount(address, blockTagOrNumberOrHash) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let transactionCount = await this.provider.getTransactionCount(address, blockTagOrNumberOrHash);
        return transactionCount;
    }
    // Official JSON-RPC commands supported by Ethereum nodes
    // Duplicates the getBlock function, but we want to stick as closely to the original JSON-RPC commands
    async getBlockByNumber(number) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let block = await this.provider.getBlock(number);
        return block;
    }
    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns information about a block based on its hash.
    // Duplicates the getBlock function, but we want to stick as closely to the original JSON-RPC commands
    async getBlockByHash(hash) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let block = await this.provider.getBlock(hash);
        return block;
    }
    // Official JSON-RPC commands supported by Ethereum nodes - No equivalent in ethers
    //Returns the information about a transaction requested by transaction hash.
    async getTransactionByHash(hash) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let transaction = await this.provider.getTransaction(hash);
        return transaction;
    }
    // Official JSON-RPC commands supported by Ethereum nodes - No equivalent in Alchemy
    // Returns information about a transaction by block hash and transaction index.
    // async getTransactionByBlockHashAndIndex(hash: string, index: number): Promise<Transaction | null> {
    async getTransactionByBlockHashAndIndex(hash, index) {
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
    async getTransactionReceipt(transactionHash) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let transactionReceipt = await this.provider.getTransactionReceipt(transactionHash);
        return transactionReceipt;
    }
    // Non JSON-RPC method
    // TODO: Refactor when we consolidate the keystore
    async createNewWallet() {
        let wallet = ethers_1.Wallet.createRandom();
        console.log(wallet);
        return wallet;
    }
    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns an array of all logs matching a given filter object.
    async getLogs(filter) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let logs = await this.provider.getLogs(filter);
        return logs;
    }
    // TO-DO: Finish - Official JSON-RPC commands supported by Ethereum nodes
    // Creates new message call transaction or a contract creation for signed transactions.
    async sendTransaction(_tx) {
        // We may need to sign the transaction before sending it
    }
    // A method that returns a transaction so that fields can be specified before sending it 
    prepareTransaction() {
        return new ethers_1.Transaction();
    }
    // Non-rpc method
    // Returns the fee data for the current network
    async feeData() {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let fees = await this.provider.getFeeData();
        return fees;
    }
    // A non-rpc method designed for convenience
    // Sends a transaction to the given address with the given Ethereum value
    async sendEther(toAddress, ethereumValue) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let tx = this.prepareTransaction();
        tx.to = toAddress;
        tx.value = ethers_1.ethers.parseEther(ethereumValue);
        tx.chainId = (await this.provider.getNetwork()).chainId;
        tx.gasLimit = 21000;
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
    async estimateGweiFee(transaction) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        const totalGas = await this.provider.estimateGas(transaction);
        const totalGasFixedNumber = ethers_1.FixedNumber.fromValue(totalGas);
        const divisor = ethers_1.FixedNumber.fromValue(1000);
        const gwei = totalGasFixedNumber.div(divisor);
        return gwei;
    }
    // Official JSON-RPC commands supported by Ethereum nodes
    // Returns code at a given address.
    async getCode(address, blockTagOrNumberOrHash) {
        if (this.provider == undefined) {
            throw Error("Provider not initialised");
        }
        let code = await this.provider.getCode(address, blockTagOrNumberOrHash);
        return code;
    }
}
exports.EthClient = EthClient;
var Providers;
(function (Providers) {
    Providers[Providers["Alchemy"] = 0] = "Alchemy";
    Providers[Providers["Infura"] = 1] = "Infura";
    Providers[Providers["JsonRpc"] = 2] = "JsonRpc";
})(Providers || (exports.Providers = Providers = {}));
exports.default = EthClient;
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
