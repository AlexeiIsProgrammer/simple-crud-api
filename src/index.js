"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const http_1 = require("http");
const url_1 = require("url");
const controller_1 = __importDefault(require("./controller"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
(0, dotenv_1.config)();
const CPUs = os_1.default.cpus().length;
const port = Number(process.env.PORT) || 4000;
const users = [];
if (cluster_1.default.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < CPUs; i++) {
        cluster_1.default.fork();
    }
    let nextWorkerIndex = 0;
    const workers = Object.values(cluster_1.default?.workers || {});
    const loadBalancer = (0, http_1.createServer)((req, res) => {
        const worker = workers[nextWorkerIndex];
        const workerPort = port + 1 + (nextWorkerIndex % CPUs);
        const targetUrl = `http://localhost:${workerPort}${req.url}`;
        console.log(`Forwarding request to worker ${worker?.process.pid}: ${targetUrl}`);
        const proxyReq = (0, http_1.request)(targetUrl, { method: req.method, headers: req.headers }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 505, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });
        req.pipe(proxyReq, { end: true });
        nextWorkerIndex = (nextWorkerIndex + 1) % CPUs;
    });
    loadBalancer.listen(port);
}
else {
    const workerPort = port + cluster_1.default.worker.id;
    const server = (0, http_1.createServer)((req, res) => {
        const { pathname } = (0, url_1.parse)(req.url || '', true);
        (0, controller_1.default)(req, res, users, pathname || '');
        server.on('error', (res) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Technical work is underway, come back later' }));
        });
    });
    server.listen(workerPort, () => {
        console.log(`Worker ${cluster_1.default.worker.id} is listening on port ${workerPort}`);
    });
}
