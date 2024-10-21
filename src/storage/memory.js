"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = void 0;
class MemoryStorage {
    /**
     * Writes the data to the file and returns the contents
     * @param filename the name of the file to write to
     * @param data the data to write to the file
     * @returns : Promise<T>
     * @throws Error
     */
    async asyncWrite(filename, data) {
        this.store[filename] = data;
        return data;
    }
    /**
     * Reads the file and returns the contents
     * @param filename the name of the file to read
     * @returns Promise<T>
     * @throws Error
     */
    async asyncRead(filename) {
        return this.store[filename];
    }
    /**
     * Based on the filename, checks if the file exists
     * @param filename the name of the file to check for
     * @returns boolean
     */
    exists(filename) {
        if (this.store.hasOwnProperty(filename)) {
            return true;
        }
        return false;
    }
}
exports.MemoryStorage = MemoryStorage;
