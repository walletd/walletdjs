import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Interface } from 'bip32';
import { Blockstream, Provider, TransactionResult } from './providers';
import { BaseWallet } from '../wallets';

export enum AddressType {
    "p2pkh" = "p2pkh",
    "p2sh" = "p2sh",
    "p2wpkh" = "p2wpkh",
    "p2wsh" = "p2wsh",
    "p2tr" = "p2tr",
  }

export interface InputInterface {
    address?: string;
    hash: string;
    index: number;
    nonWitnessUtxo?: Buffer;
    //script?: Buffer;
    value: number;
}

export class BitcoinWallet implements BaseWallet {
    legacyAddress: string;
    primaryAddress: string;
    root: BIP32Interface;
    network: bitcoin.Network = bitcoin.networks.regtest;
    lookahead: number = 20;
    addresses: Array<Address> = [];
    transactions: Array<Transaction> = [];
    addressType: AddressType = AddressType.p2wpkh;
    addressNew: Array<AddressNew> = [];
    unspent: Array<InputInterface> = [];

    constructor(root: BIP32Interface, type?: AddressType) {
        this.root = root;
        this.legacyAddress =  this.generateLegacyAddress();
        this.primaryAddress = this.generateAddress()?.address!;
        if (typeof type !== 'undefined') {
            this.addressType = type;
        }
        if (this.addressType === AddressType.p2wpkh) {
            this.root = this.root.derivePath("m/84'/1'/0'");
        }
        this.addressNew.push(this.generateAddress());
        this.addressNew.push(this.generateAddress(1));
        this.addressNew.push(this.generateAddress(2));
        this.addressNew.push(this.generateAddress(3));
        this.addressNew.push(this.generateAddress(4));
        this.addressNew.push(this.generateAddress(5));
        this.addressNew.push(this.generateAddress(6));
        this.addressNew.push(this.generateAddress(7));
        this.addressNew.push(this.generateAddress(8));
        this.addressNew.push(this.generateAddress(9));
        this.addressNew.push(this.generateAddress(10));
    }

    async syncTransaction(txid: string, provider: Provider) : Promise<Array<InputInterface>> {
        let spendables: Array<InputInterface> = Array()
        let transaction = await provider.getTransaction(txid);
        let i = 0;
        const addresses = this.addressNew.map(address => address.address)
        transaction.outs.forEach(output => {
            let addressIndex = addresses.indexOf(output.address ?? '');
            if (addressIndex !== -1) {
                spendables.push({
                    address: output.address,
                    hash: transaction.txId,
                    index: i,
                    nonWitnessUtxo: Buffer.from(transaction.txHex, 'hex'),
                    //script: Buffer.from(output.script, 'hex'),
                    value: output.value
                })
            }
            i++
        })
        this.unspent.push(...spendables);
        return spendables;
    }

    async send(amount: number, address: string, provider: Provider) : Promise<string> {
        const psbt = buildp2pkh(this.unspent, [amount], [address], this.network)
        let keyPairs = Array<BIP32Interface>();
        for (const unspent of this.unspent) {
            const keyPair = this.addressNew.find((addressNew) => addressNew.address === unspent.address)?.keyPair
            if (keyPair !== undefined) {
                keyPairs.push(keyPair);
            }
        }
        const tx = signp2pkh(psbt, keyPairs)
        // console.log(tx)
        // build and broadcast to the Bitcoin Local RegTest server
        await provider.broadcast(tx.toHex())
        return tx.getId(); 
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

    generateAddress(index? : number) : AddressNew {
        if (typeof index === 'undefined') {
            index = 0;
        }
        const path = "0/" + index; // bip32
        const child = this.root.derivePath(path);
        return new AddressNew(index, child, this.addressType, this.network)
    }

    address(_index: number): string {
        return this.generateAddress(_index).address!;
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
                if (this.generateAddress(i)?.address! !== undefined) {
                    let data = await provider.getAddress(this.generateAddress(i)?.address!)
                    let transactions: Array<TransactionResult> = [];
                    if (data.chain_stats.tx_count > 0) {
                        transactions = await provider.getAddressTransactions(this.generateAddress(i)?.address!);
                    }
                    this.addresses.push(new Address(i, this.generateAddress(i)?.address!, "m/84'/0'/0'/0/" + i, transactions));
                }
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

export class AddressNew {
    index: number;
    type: AddressType = AddressType.p2wpkh;
    address?: string;
    keyPair: BIP32Interface;
    network: bitcoin.Network = bitcoin.networks.regtest;

    constructor(index: number, keyPair: BIP32Interface, type?: AddressType, network?: bitcoin.Network) {
        this.index = index;
        this.keyPair = keyPair;
        if (typeof type !== 'undefined') {
            this.type = type;
        }
        if (this.type === AddressType.p2pkh) {
            const p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: network })
            this.address = p2pkh.address!;
        } else if (this.type === AddressType.p2wpkh) {
            const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: network })
            this.address = p2wpkh.address!;
        }
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

export function buildp2pkh(unspents: Array<InputInterface>, amounts: Array<number>, addresses: Array<string>, network: bitcoin.Network): bitcoin.Psbt {
    const fee = 1e5;
    let spendable = 0
    let amount = 0

    unspents.forEach(unspent =>{
        spendable += unspent.value;
    })
    amounts.forEach(value =>{
        amount += value;
    })
    // console.log(spendable)
    // console.log(amount)
    if (spendable < amount + fee) {
        throw new Error('Insufficient funds');
    }
    // Send our own transaction
    const psbt = new bitcoin.Psbt({network: network})
    let i = 0;
    for (let unspent of unspents) {
        psbt.addInput(
        {
            hash: unspent.hash, 
            index: unspent.index,
            nonWitnessUtxo: unspent.nonWitnessUtxo,
            // witnessUtxo: {
            //     script: Buffer.from(transaction.outs[unspent.vout].script, 'hex'),
            //     value: transaction.outs[unspent.vout].value
            // }
        }
        )
        i++;
    }
    let j = 0;
    for (let address of addresses) {
        if (address !== undefined) {
            psbt.addOutput({
                address: address, 
                value: amounts[j]
            })
        }
        j++;
    }
    // Send the change back
    if (spendable - amount - fee > 0) {
        if (addresses[0] !== undefined) {
            psbt.addOutput({
                address: addresses[0], // this change address should be generated from the wallet
                value: spendable - amount - fee
            })
        }
    }
    return psbt;
}

export function signp2pkh(psbt: bitcoin.Psbt, keypairs: Array<BIP32Interface>) : bitcoin.Transaction{
    keypairs.forEach((keypair, i) => {
        psbt.signInput(i,keypair)
    })
    // psbt.signInput(0, keypair) // must be the private key corresponding to the address that received the unspent
    //psbt.validateSignaturesOfInput(0)
    psbt.finalizeAllInputs()
    const tx = psbt.extractTransaction()
    return tx;
}
