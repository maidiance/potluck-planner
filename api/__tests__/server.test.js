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

  test('can insert a new user and find it', async() => {
    const newUser = {username: 'lana', password: 'llama'};
    const result = await Users.insert(newUser)
    expect(result.user_id).toBe(4);
    expect(result.username).toBe('lana');
  });
});

describe('test users endpoints', () => {
  describe('[POSt] /api/users/register', () => {
    test('responds with a correct status and user is added to database', async() => {
      let result = await request(server)
        .post('/api/users/register')
        .send({username: 'leaf', password: 'spring'});
      expect(result.status).toBe(201);
      result = await Users.findById(5);
      expect(result.username).toBe('leaf');
      expect(result.password).not.toBe('spring');
    });

    test('responds with a correct status and message without username', async() => {
      let result = await request(server)
        .post('/api/users/register')
        .send({password: 'foobar'});
      expect(result.status).toBe(400);
      expect(result.body.message).toMatch(/username required/i);
    });

    test('responds with a correct status and message without password', async() => {
      let result = await request(server)
        .post('/api/users/register')
        .send({username: 'foobar'});
      expect(result.status).toBe(400);
      expect(result.body.message).toMatch(/password required/i);
    });
  });
});