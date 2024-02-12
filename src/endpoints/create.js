"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const uuid_1 = require("uuid");
const createUser = (req, res, users) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const bodyUser = JSON.parse(body);
            if (!(bodyUser.age && bodyUser.username && bodyUser.hobbies)) {
                throw new Error();
            }
            const newUser = { ...bodyUser, id: (0, uuid_1.v4)() };
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Username, age and hobbies (at least an empty array) are required fields' }));
            return;
        }
    });
};
exports.createUser = createUser;
