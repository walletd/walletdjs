"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorage = exports.MemoryStorage = void 0;
const memory_1 = require("./memory");
Object.defineProperty(exports, "MemoryStorage", { enumerable: true, get: function () { return memory_1.MemoryStorage; } });
const file_1 = require("./file");
Object.defineProperty(exports, "FileStorage", { enumerable: true, get: function () { return file_1.FileStorage; } });
