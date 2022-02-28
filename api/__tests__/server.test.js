const request = require('supertest');
const server = require('../server');
const db = require('./../data/db-config');
const Users = require('./../users/user-model');
const Potluck = require('./../potlucks/potluck-model');

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

describe('test Potluck model', () => {
  test('can find a potluck by id', async() => {
    await db('potluck').insert({name: 'bobs potluck', date: 'jan 1', time: '1pm', location: '3rd apple ln', user_id: 2});
    let [result] = await Potluck.findById(1);
    expect(result.name).toBe('bobs potluck');
  });

  test('can insert potluck', async() => {
    let result = await Potluck.insert({name: 'bloom potluck', date: 'feb 2', time: '2pm', location: '2nd cherry st', user_id: 3});
    expect(result.name).toBe('bloom potluck');
  });

  test('can update potluck', async() => {
    let result = await Potluck.update(1, {name: 'bobs birthday'});
    expect(result.name).toBe('bobs birthday');
    expect(result.date).toBe('jan 1');
    expect(result.time).toBe('1pm');
    expect(result.location).toBe('3rd apple ln');
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

  describe('[POST] /api/auth/login', () => {
    test('responds with correct status and message on invalid credentials', async() => {
      let result = await request(server)
        .post('/api/users/login')
        .send({ username: 'Captain Marvel', password: 'foobar' });
      expect(result.status).toBe(401);
      expect(result.body.message).toMatch(/invalid user/i);
    });

    test('responds with correct status and message on valid credentials', async() => {
      let result = await request(server)
        .post('/api/users/register')
        .send({ username: 'Captain Marvel', password: 'foobar' });
      result = await request(server)
        .post('/api/users/login')
        .send({ username: 'Captain Marvel', password: 'foobar' });
      expect(result.status).toBe(200);
      expect(result.body.message).toMatch(/welcome Captain Marvel/i);
    });
  });
});