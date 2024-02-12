export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type BodyUser = Omit<User, 'id'>;
