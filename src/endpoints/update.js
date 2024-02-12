"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const uuid_1 = require("uuid");
const updateUser = (req, res, users, pathname) => {
    const id = pathname.split('/')[2];
    if (!(0, uuid_1.validate)(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
        return;
    }
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const updateUser = JSON.parse(body);
            const index = users.findIndex((user) => user.id === id);
            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User doesnt exist' }));
            }
            else {
                users[index] = { ...users[index], ...updateUser };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(users[index]));
            }
        }
        catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "You didn't provide all arguments!" }));
        }
    });
};
exports.updateUser = updateUser;
