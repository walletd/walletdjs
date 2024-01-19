import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';
import { Blockstream, TransactionResult } from '../providers';

const bip32 = BIP32Factory(ecc);

class Wallet {
    legacyAddress: string;
    primaryAddress: string;
    mnemonic: string;
    seed: Buffer;
    root: BIP32Interface;
    network: bitcoin.Network = bitcoin.networks.testnet;
    lookahead: number = 20;
    addresses: Array<Address> = [];
    transactions: Array<Transaction> = [];

    constructor(mnemonic: string) {
        this.mnemonic = mnemonic;
        this.seed = bip39.mnemonicToSeedSync(mnemonic);
        this.root = bip32.fromSeed(this.seed);
        this.legacyAddress =  this.generateLegacyAddress();
        this.primaryAddress = this.generateAddress();
    }
    static generate() : Wallet {
        return new Wallet(bip39.generateMnemonic(256));
    }

    xpriv() : string {
        return this.root.toBase58();
    }

    xpub() : string {
        return this.root.neutered().toBase58();
    }

    generateLegacyAddress(index? : number) : string {
        if (typeof index === 'undefined') {
            index = 0;
        }
        const path = "m/0/" + index; // bip32 
        const child = this.root.derivePath(path);
        return bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: this.network }).address!;
    }

    generateAddress(index? : number) : string {
        if (typeof index === 'undefined') {
            index = 0;
        }
        let coinType = 0;
        if (this.network === bitcoin.networks.testnet) {
            coinType = 1;
        }
        const path = "m/84'/" + coinType + "'/0'/0/" + index; // bip84 bech32
        const child = this.root.derivePath(path);
        return bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: this.network }).address!;
    }

    generateChangeAddress(index? : number) : string {
        if (typeof index === 'undefined') {
            index = 0;
        }
        let coinType = 0;
        if (this.network === bitcoin.networks.testnet) {
            coinType = 1;
        }
        const path = "m/84'/" + coinType + "'/0'/1/" + index; // bip84 bech32
        const child = this.root.derivePath(path);
        return bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: this.network }).address!;
    }

    async sync(provider: Blockstream) : Promise<void> {
            let i = 0;
            while (i < this.lookahead) {
                let data = await provider.getAddress(this.generateAddress(i))
                let transactions: Array<TransactionResult> = [];
                if (data.chain_stats.tx_count > 0) {
                    transactions = await provider.getAddressTransactions(this.generateAddress(i));
                }
                this.addresses.push(new Address(i, this.generateAddress(i), "m/84'/0'/0'/0/" + i, transactions));

                // let data = await provider.getAddress(this.generateAddress(i))
                // console.log(data);
                i++;
            }
    }

    async syncChange(provider: Blockstream) : Promise<void> {
        let i = 0;
        while (i < this.lookahead) {
            let data = await provider.getAddress(this.generateChangeAddress(i))
            let transactions: Array<TransactionResult> = [];
            if (data.chain_stats.tx_count > 0) {
                transactions = await provider.getAddressTransactions(this.generateChangeAddress(i));
            }
            this.addresses.push(new Address(i, this.generateChangeAddress(i), "m/84'/0'/0'/1/" + i, transactions, 'internal'));

            // let data = await provider.getAddress(this.generateAddress(i))
            // console.log(data);
            i++;
        }
    }

    async syncAll(provider: Blockstream) : Promise<void> {
        await this.sync(provider);
        await this.syncChange(provider);

        let addresses = this.addresses.map(address => address.address)
        let spendTxs: Array<string> = [];
        // get outgoing transactions
        this.addresses.forEach(address => {
            address.txs.forEach(tx => {
                let confirmedReceived = 0;
                let confirmedSpent = 0;
                for (let input of tx.vin) {
                    if (input.prevout.scriptpubkey_address === address.address) {
                        confirmedSpent += input.prevout.value;
                        spendTxs.push(tx.txid);
                    }
                }

                for (let output of tx.vout) {
                    if (output.scriptpubkey_address === address.address || addresses.indexOf(output.scriptpubkey_address) !== -1) {
                        confirmedReceived += output.value;
                    }
                }
                if (confirmedSpent > 0) {
                    this.transactions.push(new Transaction('outgoing',tx.txid, tx.fee, (confirmedSpent-confirmedReceived), tx.status.confirmed, address.address, tx.status.block_time));
                }
            })
        })
        // get incoming transactions
        this.addresses.forEach(address => {
            address.txs.forEach(tx => {
                if (spendTxs.indexOf(tx.txid) === -1) {
                    let confirmedReceived = 0;

                    for (let output of tx.vout) {
                        if (output.scriptpubkey_address === address.address || output.scriptpubkey_address === this.generateChangeAddress(address.index)) {
                            confirmedReceived += output.value;
                        }
                    }
                    this.transactions.push(new Transaction('incoming',tx.txid, tx.fee, (confirmedReceived), tx.status.confirmed, address.address, tx.status.block_time));
                }  
            })
        })

        this.transactions.sort((a, b) => {
            if (a.timestamp < b.timestamp) {
                return -1;
            }
            if (a.timestamp > b.timestamp) {
                return 1;
            }
            return 0;
        })
    }
}

class Address {
    index: number;
    address: string;
    type: string = 'external'
    derivationPath: string;
    confirmedReceived: number = 0;
    confirmedSpent: number = 0;
    confirmedUnspent: number = 0;
    txs: Array<TransactionResult>;

    constructor(index: number, address: string, derivationPath: string, txs: Array<TransactionResult>, type?: string) {
        this.index = index;
        this.address = address;
        this.derivationPath = derivationPath;
        this.txs = txs;
        if (typeof type !== 'undefined') {
            this.type = type;
        }
    }

    getBalance() : number {
        let confirmedReceived = 0;
        let confirmedSpent = 0;
        for (let tx of this.txs) {
            for (let output of tx.vout) {
                if (output.scriptpubkey_address === this.address) {
                    confirmedReceived += output.value;
                }
                
            }
            for (let input of tx.vin) {
                if (input.prevout.scriptpubkey_address === this.address) {
                    confirmedSpent += input.prevout.value;
                }
            }
        }
        this.confirmedReceived = confirmedReceived;
        this.confirmedSpent = confirmedSpent;
        this.confirmedUnspent = confirmedReceived - confirmedSpent;
        let balance = confirmedReceived - confirmedSpent;
        return balance;
    }
}

class Transaction {
    direction: string;
    txid: string;
    fee: number;
    amount: number;
    confirmed: boolean;
    address: string;
    timestamp: number;

    constructor(direction: string, txid: string, fee: number, amount: number, confirmed: boolean, address: string, timestamp: number) {
        this.direction = direction;
        this.txid = txid;
        this.fee = fee;
        this.amount = amount;
        this.confirmed = confirmed;
        this.address = address;
        this.timestamp = timestamp;
    }
}

interface Unspent {
    value: number;
    txId: string;
    vout: number;
    address?: string;
    height?: number;
  }

  interface Input {
    txId: string;
    vout: number;
    script: string;
    sequence: string;
  }
  
  interface Output {
    value: number;
    script: string;
    address?: string;
  }
  
//   interface Request {
//     method?: string;
//     url?: string;
//     body?: string;
//   }
  
  interface TransactionInterface {
    txId: string;
    txHex: string;
    vsize: number;
    version: number;
    locktime: number;
    ins: Input[];
    outs: Output[];
  }

  interface AddressKeyPair {
    keyPairs: Array<BIP32Interface>;
    addresses: Array<string>;
  }

(async () => {
const bitcoin = require('bitcoinjs-lib')
const { RegtestUtils } = require('regtest-client')
const regtestUtils = new RegtestUtils(bitcoin)

const wallet = new Wallet("black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit");
const wallet2 = new Wallet("base federal window toy legal cherry minute wrestle junior tribe gym palace trumpet damage dragon network rude harbor drum attract excess cream wing inquiry");
//const wallet2 = Wallet.generate();
console.log(regtestUtils.network);
console.log(wallet2.mnemonic);
//const address = wallet.generateAddress();
//console.log(address);
//const unspent = await regtestUtils.faucet(address, 2e4)

const senderPathIndexes = [0,1]
let senders: AddressKeyPair = generateAddresses(wallet2, senderPathIndexes);
const receiverPathIndexes = [0,1,2,3,4];
let receivers: AddressKeyPair = generateAddresses(wallet2, receiverPathIndexes);

function generateAddresses(w: Wallet, pathIndexes: Array<number>): AddressKeyPair {
    let keyPairs: Array<BIP32Interface> = Array();
    let addresses: Array<string> = Array();
    pathIndexes.forEach(i => {
        const path = "m/0/" + i; // bip32
        const child = w.root.derivePath(path);
        keyPairs.push(child);
        const p2pkh = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: regtestUtils.network })
        addresses.push(p2pkh.address);
        
    })
    return {keyPairs, addresses}
}
const receiverAmounts = [2e7, 2e7, 2e7, 2e7, 2e7];
const faucetAmounts = [1001e5, 2e7];
let unspentsArray = Array()
for (let i = 0; i < senders.addresses.length; i++) {
    unspentsArray.push(await regtestUtils.faucet(senders.addresses[i], faucetAmounts[i]))
}
console.log(unspentsArray)
// Tell the server to send you coins (satoshis)
// Can pass Buffer of the scriptPubkey (in case address can not be parsed by bitcoinjs-lib)
// Non-standard outputs will be rejected, though.
//const unspentComplex = await regtestUtils.faucetComplex(p2pkh.output, 1e4)
//console.log(unspentComplex)
// Get all current unspents of the address.
// const unspents = await regtestUtils.unspents(p2pkh.address)
// console.log(unspents)

// Mine 6 blocks, returns an Array of the block hashes
// All of the above faucet payments will confirm
const results = await regtestUtils.mine(6)
console.log(results)
let fetchedTransactions: Array<TransactionInterface> = Array()
for (let i = 0; i < unspentsArray.length; i++) {
    fetchedTransactions.push(await regtestUtils.fetch(unspentsArray[i].txId))
}

console.log(fetchedTransactions)


function buildp2pkh(unspents: Array<Unspent>, transactions: Array<TransactionInterface>, amounts: Array<number>, addresses: Array<string>, network: bitcoin.Network): bitcoin.Psbt {
    const fee = 1e5;
    let spendable = 0
    let amount = 0

    unspents.forEach(unspent =>{
        spendable += unspent.value;
    })
    amounts.forEach(value =>{
        amount += value;
    })
    console.log(spendable)
    console.log(amount)
    if (spendable < amount + fee) {
        throw new Error('Insufficient funds');
    }
    // Send our own transaction
    const psbt = new bitcoin.Psbt({network: network})
    let i = 0;
    for (let unspent of unspents) {
        const transaction: TransactionInterface = transactions[i];
        psbt.addInput({
            hash: unspent.txId, 
            index: unspent.vout,
            nonWitnessUtxo: Buffer.from(transaction.txHex, 'hex')
        })
        i++;
    }
    let j = 0;
    for (let address of addresses) {
        psbt.addOutput({
            address: address, 
            value: amounts[j]
        })
        j++;
    }
    // Send the change back
    if (spendable - amount - fee > 0) {
        psbt.addOutput({
            address: addresses[0], 
            value: spendable - amount - fee
        })
    }
    return psbt;
}

function signp2pkh(psbt: bitcoin.Psbt, keypairs: Array<BIP32Interface>) : bitcoin.Transaction{
    keypairs.forEach((keypair, i) => {
        psbt.signInput(i,keypair)
    })
    // psbt.signInput(0, keypair) // must be the private key corresponding to the address that received the unspent
    //psbt.validateSignaturesOfInput(0)
    psbt.finalizeAllInputs()
    const tx = psbt.extractTransaction()
    return tx;
}

const psbt = buildp2pkh(unspentsArray, fetchedTransactions, receiverAmounts, receivers.addresses, regtestUtils.network)
const tx = signp2pkh(psbt, senders.keyPairs)
// console.log(tx)
// build and broadcast to the Bitcoin Local RegTest server
await regtestUtils.broadcast(tx.toHex())
//await regtestUtils.mine(6)
console.log('transaction broadcasted')
const fetched2Tx = await regtestUtils.fetch(tx.getId())
console.log(fetched2Tx)
// This verifies that the vout output of txId transaction is actually for value
// in satoshis and is locked for the address given.
// The utxo can be unconfirmed. We are just verifying it was at least placed in
// the mempool.
await regtestUtils.verify({
  txId: tx.getId(),
  address: receivers.addresses[0],
  vout: 0,
  value: receiverAmounts[0]
})
// console.log(wallet.mnemonic);
// console.log(wallet.seed);
// console.log(wallet.xpriv());
// console.log(wallet.xpub()); 
// console.log(wallet.legacyAddress);
console.log(wallet.generateAddress());
// console.log(wallet.generateAddress(5));

// const provider = new Blockstream('https://blockstream.info/testnet/api');
// console.log(provider.url)
// const transactions = await provider.getAddressTransactions(wallet.generateAddress(1))
// console.log(transactions);
// await wallet.sync(provider);
// await wallet.syncChange(provider);

// await wallet.syncAll(provider);
// console.table(wallet.transactions);
wallet.addresses.forEach(address => {
    console.log(address.address, address.getBalance());
})
// let address = new Address(wallet.generateAddress(1), "m/84'/0'/0'/0/1", transactions);
// console.log(address.getBalance());
// console.log(address.confirmedReceived, address.confirmedSpent, address.confirmedUnspent)
})();