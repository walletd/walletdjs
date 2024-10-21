"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorage = void 0;
const fs_1 = require("fs");
const fs_2 = require("fs");
const path_1 = require("path");
class FileStorage {
    /**
     * Writes the data to the file and returns the contents
     * @param filename the name of the file to write to
     * @param data the data to write to the file
     * @returns : Promise<T>
     * @throws Error
     */
    async asyncWrite(filename, data) {
        const json = JSON.stringify(data);
        await fs_1.promises.writeFile((0, path_1.join)(__dirname, filename), json, {
            flag: "w",
        });
        const contents = await fs_1.promises.readFile((0, path_1.join)(__dirname, filename), "utf-8");
        const parsed = JSON.parse(contents);
        return parsed;
    }
    /**
     * Reads the file and returns the contents
     * @param filename the name of the file to read
     * @returns Promise<T>
     * @throws Error
     */
    async asyncRead(filename) {
        const contents = await fs_1.promises.readFile((0, path_1.join)(__dirname, filename), "utf-8");
        const parsed = JSON.parse(contents);
        return parsed;
    }
    /**
     * Based on the filename, checks if the file exists
     * @param filename the name of the file to check for
     * @returns boolean
     */
    exists(filename) {
        if ((0, fs_2.existsSync)((0, path_1.join)(__dirname, filename))) {
            // console.log("file exists")
            return true;
        }
        else {
            // console.log("file does not exist")
            return false;
        }
    }
}
exports.FileStorage = FileStorage;
