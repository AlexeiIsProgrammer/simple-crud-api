import { IncomingMessage } from 'http';

export default function chooseEndpoint(pathname: string, req: IncomingMessage) {
  switch (true) {
    case pathname === '/users' && req.method === 'GET':
      console.log('true users');
      break;
    case pathname === '/falsers' && req.method === 'GET':
      console.log('false users');
      break;

    default:
      break;
  }
}
