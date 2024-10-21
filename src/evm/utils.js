"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGasMargin = exports.calculateFee = exports.fromGwei = exports.toGwei = exports.extractFeeData = exports.generateId = exports.parseBlockResponse = exports.parseTxResponse = exports.parseTxRequest = exports.parseSwapParams = exports.toEthereumTxRequest = void 0;
const types_1 = require("@chainify/types");
const utils_1 = require("@chainify/utils");
const bignumber_1 = require("@ethersproject/bignumber");
const constants_1 = require("@ethersproject/constants");
const solidity_1 = require("@ethersproject/solidity");
const transactions_1 = require("@ethersproject/transactions");
function toEthereumTxRequest(tx, fee) {
    return {
        ...tx,
        value: tx.value && new types_1.BigNumber(tx.value.toString()),
        gasLimit: tx.gasLimit?.toNumber(),
        gasPrice: tx.gasPrice?.toNumber(),
        maxFeePerGas: tx.maxFeePerGas?.toNumber(),
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toNumber(),
        fee,
    };
}
exports.toEthereumTxRequest = toEthereumTxRequest;
function parseSwapParams(tx) {
    return {
        amount: tx.value.toString(10),
        expiration: tx.expiration,
        secretHash: (0, utils_1.ensure0x)(tx.secretHash),
        tokenAddress: (0, utils_1.ensure0x)(tx.asset.type === types_1.AssetTypes.native ? constants_1.AddressZero : tx.asset.contractAddress),
        refundAddress: (0, utils_1.ensure0x)(tx.refundAddress.toString()),
        recipientAddress: (0, utils_1.ensure0x)(tx.recipientAddress.toString()),
    };
}
exports.parseSwapParams = parseSwapParams;
function parseTxRequest(request) {
    const result = {
        chainId: request.chainId,
        to: (0, utils_1.ensure0x)(request.to?.toString()),
        from: (0, utils_1.ensure0x)(request.from?.toString()),
        data: (0, utils_1.ensure0x)(request.data?.toString()),
        nonce: toEthersBigNumber(request.nonce),
        gasLimit: toEthersBigNumber(request.gasLimit),
        value: toEthersBigNumber(request.value),
    };
    if (request.maxFeePerGas && request.maxPriorityFeePerGas) {
        result.type = transactions_1.TransactionTypes.eip1559;
        result.gasPrice = null;
        result.maxFeePerGas = toEthersBigNumber(request.maxFeePerGas);
        result.maxPriorityFeePerGas = toEthersBigNumber(request.maxPriorityFeePerGas);
    }
    else {
        result.type = transactions_1.TransactionTypes.legacy;
        result.gasPrice = toEthersBigNumber(request.gasPrice);
    }
    return result;
}
exports.parseTxRequest = parseTxRequest;
function parseTxResponse(response, receipt) {
    const result = {
        to: response.to,
        from: response.from,
        hash: response.hash,
        data: response.data,
        value: parseInt(response.value?.toString()),
        blockHash: response.blockHash,
        blockNumber: response.blockNumber,
        confirmations: Math.max(response.confirmations, 0),
        feePrice: parseInt(response.gasPrice?.toString()),
        _raw: response,
    };
    if (receipt?.confirmations > 0) {
        result.status = Number(receipt.status) > 0 ? types_1.TxStatus.Success : types_1.TxStatus.Failed;
        result.logs = receipt.logs;
    }
    else {
        result.status = types_1.TxStatus.Pending;
    }
    return result;
}
exports.parseTxResponse = parseTxResponse;
function parseBlockResponse(block, transactions) {
    return {
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp,
        parentHash: block.parentHash,
        difficulty: block.difficulty,
        nonce: Number(block.nonce),
        transactions: transactions?.map((t) => parseTxResponse(t)),
        _raw: block,
    };
}
exports.parseBlockResponse = parseBlockResponse;
function generateId(htlcData, blockTimestamp) {
    return (0, solidity_1.sha256)(['address', 'uint256', 'uint256', 'uint256', 'bytes32', 'address'], [
        htlcData.refundAddress,
        blockTimestamp,
        htlcData.amount.toString(),
        htlcData.expiration,
        htlcData.secretHash,
        htlcData.recipientAddress,
    ]);
}
exports.generateId = generateId;
function extractFeeData(fee) {
    if (typeof fee === 'number') {
        return { gasPrice: fromGwei(fee).toNumber() };
    }
    else {
        const eip1559Fee = {};
        if (fee.maxFeePerGas) {
            eip1559Fee.maxFeePerGas = fromGwei(fee.maxFeePerGas).toNumber();
        }
        if (fee.maxPriorityFeePerGas) {
            eip1559Fee.maxPriorityFeePerGas = fromGwei(fee.maxPriorityFeePerGas).toNumber();
        }
        return { ...fee, ...eip1559Fee };
    }
}
exports.extractFeeData = extractFeeData;
function toGwei(wei) {
    return new types_1.BigNumber(wei).div(1e9);
}
exports.toGwei = toGwei;
function fromGwei(gwei) {
    return new types_1.BigNumber(gwei).multipliedBy(1e9).dp(0, types_1.BigNumber.ROUND_CEIL);
}
exports.fromGwei = fromGwei;
function calculateFee(base, multiplier) {
    return new types_1.BigNumber(base).times(multiplier).toNumber();
}
exports.calculateFee = calculateFee;
function toEthersBigNumber(a) {
    if (a?.toString()) {
        return bignumber_1.BigNumber.from(a.toString(10));
    }
}
function calculateGasMargin(value, margin = 1000) {
    const offset = new types_1.BigNumber(value.toString()).multipliedBy(margin).div('10000');
    return toEthersBigNumber(offset.plus(value.toString()).toFixed(0));
}
exports.calculateGasMargin = calculateGasMargin;
