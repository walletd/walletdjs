import { MemoryStorage } from "./memory";
import { FileStorage } from "./file";
export { MemoryStorage, FileStorage };

export interface WalletDStorage {
  asyncWrite<T>(filename: string, data: any): Promise<T>;
  asyncRead<T>(filename: string): Promise<T>;
  exists(filename: string): boolean;
}
