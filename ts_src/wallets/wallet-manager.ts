import { HDWallet } from ".";

export class WalletManager {
    wallets: Array<HDWallet>;

    constructor () {
        this.wallets = Array();
    }

    createHDWallet() : HDWallet {
        const wallet = HDWallet.generate();
        this.wallets.push(wallet);
        return wallet;
    }
    
    importHDWallet(mnemonic: string) : HDWallet {
        const wallet = new HDWallet(mnemonic);
        this.wallets.push(wallet);
        return wallet;
    }
}