const request = require('supertest');
const server = require('../server');
const db = require('./../data/db-config');
const Users = require('./../users/user-model');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async () => {
  await db.destroy();
});

describe('server.js', () => {
  it('is the correct testing environment', async () => {
    expect(process.env.NODE_ENV).toBe('testing');
  });
});

describe('test User model', () => {
  test('can find a user by username', async() => {
    await db('users').insert({username: 'test', password: 'abc'});
    await db('users').insert({username: 'bob', password: '123'});
    await db('users').insert({username: 'bloom', password: 'tech'});
    let [result] = await Users.findBy({username: 'bob'});
    expect(result.username).toBe('bob');
  });
});