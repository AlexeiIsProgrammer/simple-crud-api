import { validate } from 'uuid';
import { ResType, User } from '../types';

export const getAllUsers = (res: ResType, users: User[]) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const getUser = (res: ResType, users: User[], pathname: string) => {
  const id = pathname.split('/')[2];

  if (!validate(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
    return;
  }

  const user = users.find((user) => user.id === id);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "User doesn't exist" }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  }
};
