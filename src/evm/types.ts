import {
  type AddressType,
  type FeeType,
  type TransactionRequest,
} from '@chainify/types';
import { Fragment, type JsonFragment } from '@ethersproject/abi';
import { type BlockWithTransactions as EthersBlockWithTransactions } from '@ethersproject/abstract-provider';
import { type PopulatedTransaction as EthersPopulatedTransaction } from '@ethersproject/contracts';
import {
  type Block as EthersBlock,
  type TransactionResponse as EthersTransactionResponse,
} from '@ethersproject/providers';
import {
  type MessageTypes,
  type SignTypedDataVersion,
  type TypedDataV1,
  type TypedMessage,
} from '@metamask/eth-sig-util';

export interface SignTypedMessageType<
  V extends SignTypedDataVersion = SignTypedDataVersion,
  T extends MessageTypes = MessageTypes,
> {
  data: V extends 'V1' ? TypedDataV1 : TypedMessage<T>;
  version: SignTypedDataVersion;
  from: string;
}

export interface EvmSwapOptions {
  contractAddress: string;
  numberOfBlocksPerRequest?: number;
  totalNumberOfBlocks?: number;
  gasLimitMargin?: number;
}

export type FeeOptions = {
  slowMultiplier?: number;
  averageMultiplier?: number;
  fastMultiplier?: number;
};

export type EthereumTransactionRequest = TransactionRequest & {
  from?: AddressType;
  nonce?: number;
  gasLimit?: number;
  gasPrice?: number;
  chainId?: number;
  type?: number;
  maxPriorityFeePerGas?: number;
  maxFeePerGas?: number;
};

export type EthereumFeeData = FeeType & {
  maxFeePerGas?: null | number;
  maxPriorityFeePerGas?: null | number;
  gasPrice?: null | number;
};

export {
  type EthersTransactionResponse,
  type EthersBlock,
  type EthersBlockWithTransactions,
  type EthersPopulatedTransaction,
};

export enum NftTypes {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export type NftProviderConfig = {
  url: string;
  apiKey: string;
};

export type MoralisConfig = NftProviderConfig & {
  appId: string;
};

export interface MulticallData {
  target: string;
  abi: ReadonlyArray<Fragment | JsonFragment | string>;
  name: string;
  params: ReadonlyArray<Fragment | JsonFragment | string>;
}
