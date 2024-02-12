"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const uuid_1 = require("uuid");
const deleteUser = (res, users, pathname) => {
    const id = pathname.split('/')[2];
    if (!(0, uuid_1.validate)(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
        return;
    }
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "User doesn't exist" }));
    }
    else {
        const deletedUser = users.splice(index, 1);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedUser));
    }
};
exports.deleteUser = deleteUser;
