"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftProviderType = exports.ExperimentType = exports.SendStatus = exports.SwapProviderType = exports.TransactionType = exports.FeeLabel = exports.AccountType = exports.Network = void 0;
var Network;
(function (Network) {
    Network["Mainnet"] = "mainnet";
    Network["Testnet"] = "testnet";
})(Network || (exports.Network = Network = {}));
var AccountType;
(function (AccountType) {
    AccountType["Default"] = "default";
    AccountType["BitcoinLedgerNativeSegwit"] = "bitcoin_ledger_nagive_segwit";
    AccountType["BitcoinLedgerLegacy"] = "bitcoin_ledger_legacy";
    AccountType["EthereumLedger"] = "ethereum_ledger";
    AccountType["RskLedger"] = "rsk_ledger";
})(AccountType || (exports.AccountType = AccountType = {}));
var FeeLabel;
(function (FeeLabel) {
    FeeLabel["Slow"] = "slow";
    FeeLabel["Average"] = "average";
    FeeLabel["Fast"] = "fast";
})(FeeLabel || (exports.FeeLabel = FeeLabel = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["Send"] = "SEND";
    TransactionType["Swap"] = "SWAP";
    TransactionType["NFT"] = "NFT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var SwapProviderType;
(function (SwapProviderType) {
    SwapProviderType["Liquality"] = "liquality";
    SwapProviderType["LiqualityBoostNativeToERC20"] = "liqualityBoostNativeToERC20";
    SwapProviderType["LiqualityBoostERC20ToNative"] = "liqualityBoostERC20toNative";
    SwapProviderType["UniswapV2"] = "uniswapV2";
    SwapProviderType["FastBTCDeposit"] = "fastBTC";
    SwapProviderType["FastBTCWithdraw"] = "fastBTCWithdraw";
    SwapProviderType["OneInch"] = "oneinchV4";
    SwapProviderType["Sovryn"] = "sovryn";
    SwapProviderType["Thorchain"] = "thorchain";
    SwapProviderType["Astroport"] = "astroport";
    SwapProviderType["Hop"] = "hop";
    SwapProviderType["Jupiter"] = "jupiter";
    SwapProviderType["DeBridge"] = "debridge";
    SwapProviderType["LiFi"] = "lifi";
    SwapProviderType["TeleSwap"] = "teleswap";
})(SwapProviderType || (exports.SwapProviderType = SwapProviderType = {}));
var SendStatus;
(function (SendStatus) {
    SendStatus["WAITING_FOR_CONFIRMATIONS"] = "WAITING_FOR_CONFIRMATIONS";
    SendStatus["SUCCESS"] = "SUCCESS";
    SendStatus["FAILED"] = "FAILED";
})(SendStatus || (exports.SendStatus = SendStatus = {}));
var ExperimentType;
(function (ExperimentType) {
    ExperimentType["ManageAccounts"] = "manageAccounts";
    ExperimentType["ReportErrors"] = "reportErrors";
})(ExperimentType || (exports.ExperimentType = ExperimentType = {}));
var NftProviderType;
(function (NftProviderType) {
    NftProviderType["OpenSea"] = "opensea";
    NftProviderType["Infura"] = "infura";
    NftProviderType["Covalent"] = "covalent";
})(NftProviderType || (exports.NftProviderType = NftProviderType = {}));
