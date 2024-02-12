import { config } from 'dotenv';
import http from 'http';
import { parse } from 'url';
import chooseEndpoint from './controller';
import { BodyUser, User } from './types';
import { v4 } from 'uuid';

config();

const users: User[] = [];

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url || '', true);

  switch (true) {
    case pathname === '/users' && req.method === 'GET':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
      break;
    case pathname === '/users' && req.method === 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const bodyUser: BodyUser = JSON.parse(body);

          if (!(bodyUser.age && bodyUser.username && bodyUser.hobbies)) {
            throw new Error();
          }

          const newUser: User = { ...bodyUser, id: v4() };

          users.push(newUser);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newUser));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Name, age and hobbies (at least an empty array) are required fields' }));
          return;
        }
      });
      break;

    default:
      break;
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
