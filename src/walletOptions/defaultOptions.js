"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = require("crypto-js");
const pbkdf2_1 = require("pbkdf2");
const defaultWalletOptions = {
    crypto: {
        async pbkdf2(password, salt, iterations, length, digest) {
            return new Promise((resolve, reject) => {
                (0, pbkdf2_1.pbkdf2)(password, salt, iterations, length, digest, (err, derivedKey) => {
                    if (err)
                        reject(err);
                    else
                        resolve(Buffer.from(derivedKey).toString('hex'));
                });
            });
        },
        async encrypt(value, key) {
            return crypto_js_1.AES.encrypt(value, key);
        },
        async decrypt(value, key) {
            return crypto_js_1.AES.decrypt(value, key);
        },
    },
    createNotification({ message }) {
        console.warn(`Notification: ${message}`);
    },
};
exports.default = defaultWalletOptions;
