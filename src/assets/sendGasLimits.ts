import { ChainId } from '../types.js';
import { hasTokens } from './chains.js';

const sendGasLimits = {
  BTC: 290,
  NATIVE_EVM: 21000, // EVM -> ETH, RBTC, MATIC, BNB, AVAX, FUSE
  ERC20_EVM: 90000, // EVM -> ETH, RBTC, MATIC, BNB, AVAX, FUSE
  SOL: 1000000000,
};

const getSendGasLimitERC20 = (chainId: ChainId): number | null => {
  if (!hasTokens(chainId)) {
    throw new Error(`Chain '${chainId}' doesn't support tokens!`);
  }

  switch (chainId) {
    default:
      // EVM standard gas limit
      return sendGasLimits.ERC20_EVM;
  }
};

export { sendGasLimits, getSendGasLimitERC20 };
