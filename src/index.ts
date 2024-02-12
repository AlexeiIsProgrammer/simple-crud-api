import { config } from 'dotenv';
import http from 'http';
import { parse } from 'url';
import { User } from './types';
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
