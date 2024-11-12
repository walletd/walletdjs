import { MemoryStorage } from './memory.js';
import { FileStorage } from './file.js';
export { MemoryStorage, FileStorage };

export interface WalletDStorage {
  asyncWrite<T>(filename: string, data: any): Promise<T>;
  asyncRead<T>(filename: string): Promise<T>;
  exists(filename: string): boolean;
}
