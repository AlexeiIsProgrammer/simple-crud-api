"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getAllUsers = void 0;
const uuid_1 = require("uuid");
const getAllUsers = (res, users) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
};
exports.getAllUsers = getAllUsers;
const getUser = (res, users, pathname) => {
    const id = pathname.split('/')[2];
    console.log(id);
    if (!(0, uuid_1.validate)(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
        return;
    }
    const user = users.find((user) => user.id === id);
    if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "User doesn't exist" }));
    }
    else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    }
};
exports.getUser = getUser;
