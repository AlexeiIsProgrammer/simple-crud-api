import { createUser } from '../endpoints/create';
import { deleteUser } from '../endpoints/delete';
import { getAllUsers, getUser } from '../endpoints/read';
import { updateUser } from '../endpoints/update';
import { ReqType, ResType, User } from '../types';

export default function chooseEndpoint(req: ReqType, res: ResType, users: User[], pathname: string) {
  switch (true) {
    case pathname === '/users' && req.method === 'GET':
      getAllUsers(res, users);
      break;
    case pathname?.startsWith('/users/') && req.method === 'GET':
      getUser(res, users, pathname);
      break;
    case pathname === '/users' && req.method === 'POST':
      createUser(req, res, users);
      break;
    case pathname?.startsWith('/users/') && req.method === 'PUT':
      updateUser(req, res, users, pathname);
      break;
    case pathname?.startsWith('/users/') && req.method === 'DELETE':
      deleteUser(res, users, pathname);
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Your path is invalid!' }));
      break;
  }
}
