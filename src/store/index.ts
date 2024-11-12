// import { createStore } from 'zustand/vanilla';
// import { Wallet, NetworkWalletIdMap, Asset, WalletId } from './types';
// type State = {
//   key: string;
//   wallets: Wallet[];
//   unlockedAt: number;
//   activeWalletId: WalletId;
//   enabledAssets: NetworkWalletIdMap<Asset[]>;
// };

// type Action = {
//   updateKey: (key: State['key']) => void;
//   createWallet: (key: string) => void;
// };

// const store = createStore<State & Action>(set => ({
//   key: '',
//   wallets: [],
//   unlockedAt: 0,
//   activeWalletId: '',
//   enabledAssets: {},
//   updateKey: key => set(() => ({ key: key })),
//   createWallet: (key: string) => set(() => ({ key: key })),
// }));

// export default store;
