"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const controller_1 = __importDefault(require("./controller"));
(0, dotenv_1.config)();
const users = [];
const server = http_1.default.createServer((req, res) => {
    const { pathname } = (0, url_1.parse)(req.url || '', true);
    (0, controller_1.default)(req, res, users, pathname || '');
});
server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
