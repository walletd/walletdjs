import { Regtest } from '../../bitcoin/providers/regtest';
import { AddressType, BitcoinWallet, AddressNew } from '../../bitcoin';
import { Wallet } from '../../wallets';

/* This example requires a local Bitcoin RegTest server running on port 8080
 the regtest docker imagee can be found at https://github.com/bitcoinjs/regtest-server
*/
(async () => {
    const regtest = new Regtest();
    // console.log(await regtest.height());
    const rootWallet = new Wallet("black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit");
    const rootWallet2 = new Wallet("base federal window toy legal cherry minute wrestle junior tribe gym palace trumpet damage dragon network rude harbor drum attract excess cream wing inquiry");
    
    const walletType = AddressType.p2wpkh;
    const walletType2 = AddressType.p2wpkh;
    const wallet = rootWallet.bitcoinWallet(walletType);
    const wallet2 = rootWallet2.bitcoinWallet(walletType2);
    //const wallet2 = Wallet.generate();
    // console.log(regtestUtils.network);
    // console.log(wallet2.mnemonic);
    // const add = wallet.generateAddress();
    // console.log(add.output?.toString('hex'));
    //const unspent = await regtestUtils.faucet(address, 2e4)
    
    const receiverAmounts = [5e7];
    const faucetAmounts = [1e8]; // Creation of the inputs we want to use, these are sent to senders addresses
    
    // let senders: Array<AddressNew> = generateAddresses(wallet, [0,1]);
    // let receivers: Array<AddressNew> = generateAddresses(wallet2, [0,1,2,3,4]);
    
    let senders: Array<AddressNew> = generateAddresses(wallet, [0]);
    let receivers: Array<AddressNew> = generateAddresses(wallet2, [0]);
    
    function generateAddresses(w: BitcoinWallet, pathIndexes: Array<number>): Array<AddressNew> {
        let addresses: Array<AddressNew> = Array();
        pathIndexes.forEach(i => {
            const address = w.generateAddress(i);
            addresses.push(address);
        })
        return addresses
    }
    
    let faucetTxs = Array()
    for (let i = 0; i < senders.length; i++) {
        faucetTxs.push((await regtest.faucet(senders[i].address ?? '', faucetAmounts[i])).txId)
    }
    
    // Mine 6 blocks, returns an Array of the block hashes
    // All of the above faucet payments will confirm
    await regtest.mineBlocks(6)
    for (let i = 0; i < faucetTxs.length; i++) {
        await wallet.syncTransaction(faucetTxs[i], regtest)
    }
    const txid = await wallet.send(5e7, receivers[0].address ?? '', regtest);
    // const psbt = buildp2pkh(wallet.unspent, receiverAmounts, receivers, regtest.network())
    // const tx = signp2pkh(psbt, senders.map(sender => sender.keyPair))
    // console.log(tx)
    // build and broadcast to the Bitcoin Local RegTest server
    // await regtest.broadcast(tx.toHex())
    
    console.log('transaction broadcasted')
    const fetched2Tx = await regtest.getTransaction(txid)
    console.log(fetched2Tx)
    // This verifies that the vout output of txId transaction is actually for value
    // in satoshis and is locked for the address given.
    // The utxo can be unconfirmed. We are just verifying it was at least placed in
    // the mempool.
    await regtest.verify({
      txId: txid,
      address: receivers[0].address,
      vout: 0,
      value: receiverAmounts[0]
    })
    // console.log(wallet.mnemonic);
    // console.log(wallet.seed);
    // console.log(wallet.xpriv());
    // console.log(wallet.xpub()); 
    // console.log(wallet.legacyAddress);
    // console.log(wallet.generateAddress());
    // console.log(wallet.generateAddress(5));
    
    // const provider = new Blockstream('https://blockstream.info/testnet/api');
    // console.log(provider.url)
    // const transactions = await provider.getAddressTransactions(wallet.generateAddress(1))
    // console.log(transactions);
    // await wallet.sync(provider);
    // await wallet.syncChange(provider);
    
    // await wallet.syncAll(provider);
    // console.table(wallet.transactions);
    // wallet.addresses.forEach(address => {
    //     console.log(address.address, address.getBalance());
    // })
    // let address = new Address(wallet.generateAddress(1), "m/84'/0'/0'/0/1", transactions);
    // console.log(address.getBalance());
    // console.log(address.confirmedReceived, address.confirmedSpent, address.confirmedUnspent)
    })();