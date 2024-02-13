import { config } from 'dotenv';
import { createServer, request } from 'http';
import { User } from './types';
import chooseEndpoint from './controller';
import cluster from 'cluster';
import os from 'os';

config();

const CPUs = os.cpus().length;
const port = Number(process.env.PORT) || 4000;
const users: User[] = [];

if (process.env.MULTI) {
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
      chooseEndpoint(req, res, users);
    });

    server.listen(workerPort, () => {
      console.log(`Worker ${cluster.worker!.id} is listening on port ${workerPort}`);
    });
  }
} else {
  const server = createServer((req, res) => {
    chooseEndpoint(req, res, users);
  });

  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
