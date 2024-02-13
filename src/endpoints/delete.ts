import { validate } from 'uuid';
import { ResType, User } from '../types';

export const deleteUser = (res: ResType, users: User[], pathname: string) => {
  const id = pathname.split('/')[3];

  if (!validate(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
    return;
  }

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "User doesn't exist" }));
  } else {
    const deletedUser = users.splice(index, 1);
    res.writeHead(204, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(deletedUser));
  }
};
