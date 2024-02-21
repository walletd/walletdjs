import { WalletDStorage } from ".";

export class MemoryStorage implements WalletDStorage{
    store: any;
/**
 * Writes the data to the file and returns the contents
 * @param filename the name of the file to write to
 * @param data the data to write to the file
 * @returns : Promise<T>
 * @throws Error
 */
async asyncWrite<T>(filename: string, data: any): Promise<T> {
    this.store[filename] = data;

    return data as T;
}
/**
 * Reads the file and returns the contents
 * @param filename the name of the file to read
 * @returns Promise<T>
 * @throws Error
 */
async asyncRead<T>(filename: string): Promise<T> {
    
    return this.store[filename] as T;
}

/**
 * Based on the filename, checks if the file exists
 * @param filename the name of the file to check for
 * @returns boolean
 */
exists(filename: string) {
    if ( this.store.hasOwnProperty(filename)) {
        return true
    }
    return false
}

}