import * as BigNumber from 'bignumber.js';
import { type IAsset } from './interfaces/IAsset.js';

/**
 * Appends 0x if missing from hex string
 */
export function ensure0x(hash: string) {
  return hash.startsWith('0x') ? hash : `0x${hash}`;
}

/**
 * Removes 0x if it exists in hex string
 */
export function remove0x(hash: string) {
  return hash.startsWith('0x') ? hash.slice(2) : hash;
}

export function unitToCurrency(
  asset: IAsset,
  value: number | BigNumber.BigNumber,
): BigNumber.BigNumber {
  const multiplier = new BigNumber.BigNumber(10).pow(asset.decimals);
  return new BigNumber.BigNumber(value).dividedBy(multiplier);
}

export function currencyToUnit(
  asset: IAsset,
  value: number | BigNumber.BigNumber,
): BigNumber.BigNumber {
  const multiplier = new BigNumber.BigNumber(10).pow(asset.decimals);
  return new BigNumber.BigNumber(value).times(multiplier);
}
