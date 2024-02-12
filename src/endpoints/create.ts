import { v4 } from 'uuid';
import { BodyUser, ReqType, ResType, User } from '../types';

export const createUser = (req: ReqType, res: ResType, users: User[]) => {
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
      res.end(JSON.stringify({ message: 'Username, age and hobbies (at least an empty array) are required fields' }));
      return;
    }
  });
};
