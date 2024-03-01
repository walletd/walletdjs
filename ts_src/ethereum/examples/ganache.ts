import { EthClient, JsonRpcProvider } from "../index";

// We use a .env file that isn't stored in version control in order to store our mnemonic phrase
// dotenv is a library that allows us to access environment variables from a .env file

async function doStuff() {
  const provider = new JsonRpcProvider("http://localhost:7545");
  let ethClient = EthClient.fromPhrase(
    "black armed enroll bicycle fall finish vague addict estate enact ladder visa tooth sample labor olive annual off vocal hurry half toy bachelor suit",
    provider,
    "m/44'/60'/0'/0/1",
  );
  const address: string = ethClient.address();
  console.log(`Address: ${address}`);
  let balance = await ethClient.getBalance();
  console.log(`Balance: ${balance}`);
  let sendTx = await ethClient.sendEther(
    "0xE5D456269322bb533903ad65f020fc83D6779595",
    "0.00001",
  );
  console.log(sendTx);
}

doStuff();
