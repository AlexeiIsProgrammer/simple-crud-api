"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("../endpoints/create");
const delete_1 = require("../endpoints/delete");
const read_1 = require("../endpoints/read");
const update_1 = require("../endpoints/update");
function chooseEndpoint(req, res, users, pathname) {
    switch (true) {
        case pathname === '/api/users' && req.method === 'GET':
            (0, read_1.getAllUsers)(res, users);
            break;
        case pathname.startsWith('/api/users/') && req.method === 'GET':
            (0, read_1.getUser)(res, users, pathname);
            break;
        case pathname === '/api/users' && req.method === 'POST':
            (0, create_1.createUser)(req, res, users);
            break;
        case pathname.startsWith('/api/users/') && req.method === 'PUT':
            (0, update_1.updateUser)(req, res, users, pathname);
            break;
        case pathname.startsWith('/api/users/') && req.method === 'DELETE':
            (0, delete_1.deleteUser)(res, users, pathname);
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Your path is invalid!' }));
            break;
    }
}
exports.default = chooseEndpoint;
