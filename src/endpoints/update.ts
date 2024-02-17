import { validate } from 'uuid';
import { ReqType, ResType, User } from '../types';

export const updateUser = (req: ReqType, res: ResType, users: User[], pathname: string) => {
  const id = pathname.split('/')[3];

  if (!validate(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const updateUser: Partial<User> = JSON.parse(body);
      const index = users.findIndex((user) => user.id === id);

      if (
        typeof updateUser.age !== 'number' ||
        typeof updateUser.username !== 'string' ||
        typeof updateUser.hobbies !== 'object'
      ) {
        throw new Error();
      }

      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User doesnt exist' }));
      } else {
        users[index] = { ...users[index], ...updateUser };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users[index]));
      }
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "You didn't provide all arguments!" }));
    }
  });
};
