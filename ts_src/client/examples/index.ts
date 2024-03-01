import {
  EthereumWallet,
  BitcoinWallet,
  BitcoinEsploraApiProvider,
  EvmChainProvider,
  EvmNetworks,
  BitcoinNetworks,
  WalletOptions,
  UTXO,
  BitcoinNetworkProviders,
} from "../";

// use this wallet options in the wallet manager.
// create wallet with default options.
// allow options to be customized as per below.

const walletOptions: WalletOptions = {
  btc: {
    mnemonic:
      "black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit",
    network: BitcoinNetworks.bitcoin_testnet,
    baseDerivationPath: "m/84'/1'/0'",
    networkProvider: BitcoinNetworkProviders.blockstream_testnet,
  },
  eth: {
    mnemonic:
      "black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit",
    derivationPath: "m/44'/60'/0'/0/0",
    network: EvmNetworks.ganache,
  },
};

// const BlockstreamEsploraTestnet2 = {
//     url: 'https://blockstream.info/testnet/api/',
//     batchUrl: 'https://blockstream.info/testnet/api/',
//     network: BitcoinNetworks.bitcoin_testnet
// }

async function test() {
  const provider = new BitcoinEsploraApiProvider(
    walletOptions.btc.networkProvider,
  );

  const bitcoin = new BitcoinWallet(walletOptions.btc, provider);
  const address = await bitcoin.getAddresses(0, 1);
  console.log(address);
  // collect all addresses
  // get balance for all addresses
  // get transaction list for all addresses
  // get utxos for all addresses
  await bitcoin._usedAddresses();

  let transactions: UTXO[] = await bitcoin._utxos();
  // console.log(usedAddresses[1].address)

  const height = await provider.getBlockHeight();
  console.log(height);

  console.log((await provider.getBalance2(transactions)).toString());
  // console.log(await provider.getBalance(usedAddresses.map(a => a.address)))
  let transactionDisplay = bitcoin._forDisplay();
  console.table(transactionDisplay);
  // console.log((await bitcoin.getBalance([])).toString())

  // Fetch height and block hash

  // Ethereum
  const ethProvider = new EvmChainProvider(walletOptions.eth.network);
  console.log(await ethProvider.getBlockHeight());

  // const txs = [
  //     '0x3a5e53533c35c03c8fe4de7a55c9939e8fee9e5b59f3f1cba8b40214530d4631',
  //     '0x087b804209b3ceb453cdf58167db007ba668f8ea87f95abbbbfb9d176b58b963',
  //     '0x726537f1fb238dc97b9a89c4a374ef7328a96ac812de810833d826648bd710f7',
  // ]

  // console.log(await ethProvider.getTransactionByHash(txs[0]))

  const ethWallet = new EthereumWallet(walletOptions.eth, ethProvider);
  console.log(await ethWallet.getAddress());
  console.log(await ethWallet.getBalance());
  // console.log(await ethWallet.estimateGas('0x52F810f5F37cb68530672F25FfF18160355e8221', 21000))
  //console.log(await ethWallet.sendTransaction('0x52F810f5F37cb68530672F25FfF18160355e8221', 21000))

  // Sign a message
  // const signedMessageBitcoin = await bitcoin.wallet.signMessage(
  //   'The Times 3 January 2009 Chancellor on brink of second bailout for banks', bitcoinAddress
  // )
  // console.log(signedMessageBitcoin)
  // const signedMessageEthereum = await ethereum.wallet.signMessage(
  //   'The Times 3 January 2009 Chancellor on brink of second bailout for banks', ethereumAddress
  // )
}

test();

// layout the unspent transactions as we have them now.
// test out the building of a transaction using what we have now.
// clean up the providers and simmer the functionality down to what we need.
// spendable transactions
// balance
// send transaction
// sign message
// generate unused address.
// work towards providing the storage to the wallet creation, it should be optional which will use in memory storage.
