import { config } from 'dotenv';
import http from 'http';
import { parse } from 'url';
import { ReqType, ResType, User } from './types';
import chooseEndpoint from './controller';

config();

const users: User[] = [];

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url || '', true);

  chooseEndpoint(req, res, users, pathname || '');
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

server.on('error', (err: Error, req: ReqType, res: ResType) => {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Technical work is underway, come back later' }));
});
