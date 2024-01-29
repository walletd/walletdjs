"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
async function doStuff() {
    let ethClient = new index_1.default("VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT");
    let envPhrase = process.env.MNEMONIC;
    if (typeof (envPhrase) == undefined) {
        console.log("Mnemonic not found in environment variables");
    }
    else {
        let phrase = envPhrase;
        await ethClient.initialiseWalletFromPhrase(phrase);
    }
    // const gasFee = fees.gasPrice;  // Replace with your preferred gas price
    // const gasPriceInGwei = ethers.parseUnits(gasPrice.toString(), 'gwei');
    let transaction = ethClient.prepareTransaction();
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
    let sendTx = await ethClient.sendEther('0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b', "0.00001");
    console.log("Type:" + typeof (sendTx) + " " + sendTx);
}
doStuff();
