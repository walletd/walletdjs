import { currencyToUnit, nativeAssets, unitToCurrency } from '../../assets';
import { CoinTypes, HDWallet } from '../index';

(async () => {
  const hdWallet = new HDWallet(
    'black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit',
  );
  const assets = [
    {
      coinType: CoinTypes.testnet,
      asset: nativeAssets.BTC,
      sendAddress: 'bcrt1qj8nvf3k2cdc6h5ach09zeapkell6sqng5u946l',
    },
    {
      coinType: CoinTypes.ethereum,
      asset: nativeAssets.ETH,
      sendAddress: '0xC674B334E12f92E45fD481A070437bDB9848FD33',
    },
  ];

  for (const asset of assets) {
    console.log(asset.asset.name);
    const client = hdWallet.createWallet(asset.coinType);
    const blockHeight = await client.chain.getBlockHeight();
    console.log(asset.asset.code + ' ' + 'Blocks ' + blockHeight);
    const addressNew = await client.wallet.getAddress();
    const balance = await client.wallet.getBalance([asset.asset]);
    console.log(
      asset.asset.code +
        ' ' +
        unitToCurrency(asset.asset, balance[0]).toString(),
    );
    console.log(addressNew.toString());
    const amountToSend = currencyToUnit(asset.asset, 0.0001);
    console.log(asset.asset.code + ' ' + amountToSend);
    //   await client.wallet.sendTransaction({
    //     to: asset.asset.sendAddress,
    //     value: amountToSend,
    //   });
  }
})();
