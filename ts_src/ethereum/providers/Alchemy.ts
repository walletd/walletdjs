interface AlchemyProviderConfiguration {
  apiKey: string;
  httpProvider: string;
  wssProvider: string;
}

function initialiseAlchemyProvider(): AlchemyProviderConfiguration {
  return {
    apiKey: apiKey,
    httpProvider: httpProvider,
    wssProvider: wssProvider,
  };
}

const apiKey: string = "VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT";
const httpProvider: string =
  "https://eth-mainnet.g.alchemy.com/v2/VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT";
const wssProvider: string =
  "wss://eth-mainnet.g.alchemy.com/v2/VqDjBvWuSn2RjrjMERoTIRw0VKlkGRRT";
