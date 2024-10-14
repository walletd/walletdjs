export interface Asset {
  ticker: string;
  name: string;
  network: string;
  hasMemo: boolean;
  isFiat: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
  contractAddress?: string;
  canBuy: boolean;
  canSell: boolean;
}

export interface Address {
  address: string;
  memo?: string;
  asset: Asset;
}
export type OrderId = string;
export type RateId = string;

export interface Order {
  id: OrderId;
  from: Address;
  to: Address;
  depositAmount?: number;
  settleAmount?: number;
  exchange: string;
  exchangeType: ExchangeTypes;
  exchangeDirection: ExchangeDirection;
  refundAddress?: Address;
  rateId?: RateId;
  status: ExchangeStatus;
}

export interface Quote extends Order {
  expiryDate: Date;
}

export enum ExchangeTypes {
  Floating = 'Floating',
  Fixed = 'Fixed',
}

export enum ExchangeDirection {
  Direct = 'Direct',
  Reverse = 'Reverse',
}

export enum ExchangeStatus {
  New = 'New',
  Waiting = 'Waiting',
  Pending = 'Pending',
  Processing = 'Processing',
  Review = 'Review',
  Settling = 'Settling',
  Settled = 'Settled',
  Refund = 'Refund',
  Refunding = 'Refunding',
  Completed = 'Completed',
}

export interface ExchangeRange {
  min: number;
  max?: number;
  rate?: number;
  fromAsset: Asset;
  toAsset: Asset;
  rateId?: RateId;
}
