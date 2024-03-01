import { EthClient, AlchemyProvider } from "../index";
// We use a .env file that isn't stored in version control in order to store our mnemonic phrase
// dotenv is a library that allows us to access environment variables from a .env file
require("dotenv").config();

async function doStuff() {
  // Todo: Replace API key with a .env variable

  const provider = new AlchemyProvider(
    "sepolia",
    "VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT",
  );
  let envPhrase = process.env.MNEMONIC;
  let ethClient: EthClient;
  if (typeof envPhrase == undefined) {
    console.log("Mnemonic not found in environment variables");
  } else {
    let phrase = envPhrase as string;
    ethClient = EthClient.fromPhrase(phrase, provider);

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
    let balance = await ethClient.getBalance();
    console.log(`Balance: ${balance}`);
    let sendTx = await ethClient.sendEther(
      "0xC0cc3358231ABB32F4ddED3336Bfc813BeA7932b",
      "0.00001",
    );
    console.log("Type:" + typeof sendTx + " " + sendTx);
  }
}

doStuff();
