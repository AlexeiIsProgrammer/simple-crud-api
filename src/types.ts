import { IncomingMessage, ServerResponse } from 'http';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type BodyUser = Omit<User, 'id'>;

export type ReqType = IncomingMessage;

export type ResType = ServerResponse<ReqType> & { req: ReqType };
