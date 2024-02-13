import supertest from 'supertest';
import { User } from '../types';
import { createServerFn } from '..';

const server = createServerFn();

describe('Server 3 scenarios', () => {
  let user: User;
  test('should get an empty array', async () => {
    const users: User[] = [];
    const { statusCode, body } = await supertest(server).get('/api/users');

    expect(statusCode).toBe(200);
    expect(body).toEqual(users);
  });

  test('should create a new user', async () => {
    const newUser: Omit<User, 'id'> = {
      username: 'Alex',
      age: 20,
      hobbies: ['sport', 'coding'],
    };

    const { body } = await supertest(server).post('/api/users').send(newUser);

    expect(body.statusCode).toBe(201);
    expect(user).toHaveProperty('id');
    expect(user.username).toEqual(newUser.username);
    expect(user.age).toEqual(newUser.age);
    expect(user.hobbies).toEqual(newUser.hobbies);
  });

  test('should get user by his id', async () => {
    const { status, body } = await supertest(server).get(`/api/users/${user.id}`);

    expect(status).toBe(200);
    expect(body.id).toEqual(user.id);
    expect(body).toEqual(user);
  });
});
