import { config } from 'dotenv';
import { createServer, request } from 'http';
import { parse } from 'url';
import { ResType, User } from './types';
import chooseEndpoint from './controller';
import cluster from 'cluster';
import os from 'os';

config();

const CPUs = os.cpus().length;
const port = Number(process.env.PORT) || 4000;
const users: User[] = [];

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }

  let nextWorkerIndex = 0;
  const workers = Object.values(cluster?.workers || {});

  const loadBalancer = createServer((req, res) => {
    const worker = workers[nextWorkerIndex];
    const workerPort = port + 1 + (nextWorkerIndex % CPUs);
    const targetUrl = `http://localhost:${workerPort}${req.url}`;

    console.log(`Forwarding request to worker ${worker?.process.pid}: ${targetUrl}`);

    const proxyReq = request(targetUrl, { method: req.method, headers: req.headers }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 505, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    nextWorkerIndex = (nextWorkerIndex + 1) % CPUs;
  });

  loadBalancer.listen(port);
} else {
  const workerPort = port + cluster.worker!.id;
  const server = createServer((req, res) => {
    const { pathname } = parse(req.url || '', true);

    chooseEndpoint(req, res, users, pathname || '');

    server.on('error', (res: ResType) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Technical work is underway, come back later' }));
    });
  });

  server.listen(workerPort, () => {
    console.log(`Worker ${cluster.worker!.id} is listening on port ${workerPort}`);
  });
}
