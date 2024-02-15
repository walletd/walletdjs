import { promises as fsPromises } from 'fs';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Writes the data to the file and returns the contents
 * @param filename the name of the file to write to
 * @param data the data to write to the file
 * @returns : Promise<T>
 * @throws Error
 */
export async function asyncWrite<T>(filename: string, data: any): Promise<T> {
    const json = JSON.stringify(data);
    await fsPromises.writeFile(join(__dirname, filename), json, {
      flag: 'w',
    });

    const contents = await fsPromises.readFile(
      join(__dirname, filename),
      'utf-8',
    );
    const parsed = JSON.parse(contents);

    return parsed as T;
}
/**
 * Reads the file and returns the contents
 * @param filename the name of the file to read
 * @returns Promise<T>
 * @throws Error
 */
export async function asyncRead<T>(filename: string): Promise<T> {
    const contents = await fsPromises.readFile(
      join(__dirname, filename),
      'utf-8',
    );
    const parsed = JSON.parse(contents);

    return parsed as T;
}

/**
 * Based on the filename, checks if the file exists
 * @param filename the name of the file to check for
 * @returns boolean
 */
export function exists(filename: string) {
    if (existsSync(join(__dirname, filename))) {
        // console.log("file exists")
        return true
    } else {
        // console.log("file does not exist")
        return false
    }
}
