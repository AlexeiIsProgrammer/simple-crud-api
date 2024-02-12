import { createUser } from '../endpoints/create';
import { getAllUsers, getUser } from '../endpoints/read';
import { ReqType, ResType, User } from '../types';

export default function chooseEndpoint(req: ReqType, res: ResType, users: User[], pathname: string) {
  switch (true) {
    case pathname === '/users' && req.method === 'GET':
      getAllUsers(res, users);
      break;
    case pathname && pathname?.startsWith('/users/') && req.method === 'GET':
      getUser(res, users, pathname);
      break;
    case pathname === '/users' && req.method === 'POST':
      createUser(req, res, users);
      break;

    default:
      break;
  }
}
