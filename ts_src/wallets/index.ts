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
    lookahead: number = 10;
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
                    this.transactions.push(new Transaction('outgoing',tx.txid, tx.fee, (confirmedSpent-confirmedReceived- tx.fee), tx.status.confirmed, address.address, tx.status.block_time));
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

(async () => {
const wallet = new Wallet("crew secret spare arrow blanket salute trash similar coin illness asthma urban olympic sugar heavy brave pulse museum foil feed crouch brief desk wish");
//const wallet = Wallet.generate();
// console.log(wallet.mnemonic);
// console.log(wallet.seed);
// console.log(wallet.xpriv());
// console.log(wallet.xpub()); 
// console.log(wallet.legacyAddress);
console.log(wallet.generateAddress());
// console.log(wallet.generateAddress(5));

const provider = new Blockstream('https://blockstream.info/testnet/api');
console.log(provider.url)
// const transactions = await provider.getAddressTransactions(wallet.generateAddress(1))
// console.log(transactions);
// await wallet.sync(provider);
// await wallet.syncChange(provider);
wallet.addresses.forEach(address => {
    console.log(address.address, address.getBalance());
})
await wallet.syncAll(provider);
console.table(wallet.transactions);
// let address = new Address(wallet.generateAddress(1), "m/84'/0'/0'/0/1", transactions);
// console.log(address.getBalance());
// console.log(address.confirmedReceived, address.confirmedSpent, address.confirmedUnspent)
})();