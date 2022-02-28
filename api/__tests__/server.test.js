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

  test('can delete potluck', async() => {
    let result = await Potluck.remove(1);
    expect(result.name).toBe('bobs birthday');
    expect(result.date).toBe('jan 1');
    expect(result.time).toBe('1pm');
    expect(result.location).toBe('3rd apple ln');
  });

  test('can add items by potluck id', async() => {
    let result = await Potluck.insertItem(2, {name: 'salsa'});
    expect(result.name).toBe('salsa');
  });

  test('can get items by potluck id', async() => {
    let result = await Potluck.findItems(2);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('salsa');
  });

  test('can get items after multiple inserts', async() => {
    await Potluck.insertItem(2, {name: 'chips'});
    await Potluck.insertItem(2, {name: 'pizza'});
    await Potluck.insertItem(2, {name: 'drinks'});
    let result = await Potluck.findItems(2);
    expect(result.length).toBe(4);
  });

  test('can update item name', async() => {
    let result = await Potluck.updateItem(1, {name: 'dip'});
    expect(result.name).toBe('dip');
  });

  test('can update responsible', async() => {
    let result = await Potluck.updateItem(1, {responsible: 1});
    expect(result.responsible).toBe(1);
  });

  test('can delete item from potluck', async() => {
    let result = await Potluck.removeItem(1);
    expect(result.name).toBe('dip');
  });
});

describe('test users endpoints', () => {
  describe('[POST] /api/users/register', () => {
    test('responds with a correct status and user is added properly to database', async() => {
      let result = await request(server)
        .post('/api/users/register')
        .send({username: 'leaf', password: 'spring'});
      expect(result.status).toBe(201);
      result = await Users.findById(5);
      expect(result.user_id).toBe(5);
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
      expect(result.body.token).not.toBeNull();
    });
  });
});

describe('test potluck endpoints', () => {
  describe('[GET] /api/potluck', () => {
    test('responds with correct status and body', async() => {
      let result = await request(server)
        .get('/api/potluck');
      expect(result.status).toBe(200);
      expect(result.body).toHaveLength(1);
    });
  });

  describe('[GET] /api/potluck/:id', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .get('/api/potluck/2');
      expect(result.status).toBe(200);
      let potluck = result.body;
      expect(potluck.pid).toBe(2);
      expect(potluck.name).toBe('bloom potluck');
      expect(potluck.date).toBe('feb 2');
      expect(potluck.time).toBe('2pm');
      expect(potluck.location).toBe('2nd cherry st');
    });

    test('responds with correct status and body sad path', async() => {
      let result = await request(server)
        .get('/api/potluck/3');
      expect(result.status).toBe(404);
      expect(result.body.message).toMatch(/potluck 3 not found/i);
    });
  });

  describe('[POST] /api/potluck', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .post('/api/potluck')
        .send({name: 'bobs potluck', date: 'jan 1', time: '1pm', location: '3rd apple ln', user_id: 2});
      expect(result.status).toBe(201);
      let potluck = result.body;
      expect(potluck.pid).toBe(3);
      expect(potluck.name).toBe('bobs potluck');
      expect(potluck.date).toBe('jan 1');
      expect(potluck.time).toBe('1pm');
      expect(potluck.location).toBe('3rd apple ln');
    });
    
    test('responds with correct status and message sad path', async() => {
      let result = await request(server)
        .post('/api/potluck')
        .send({date: 'mar 1'});
      expect(result.status).toBe(400);
      expect(result.body.message).toMatch(/missing required name/i);
    });
  });

  describe('[PUT] /api/potluck/:id', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .put('/api/potluck/2')
        .send({name: 'bobs birthday'});
      let potluck = result.body;
      expect(potluck.pid).toBe(2);
      expect(potluck.name).toBe('bobs birthday');
      expect(potluck.date).toBe('feb 2');
      expect(potluck.time).toBe('2pm');
      expect(potluck.location).toBe('2nd cherry st');
    });

    test('responds with correct status and message sad path', async() => {
      let result = await request(server)
        .put('/api/potluck/13')
        .send({name: 'test'});
      expect(result.status).toBe(404);
      expect(result.body.message).toMatch(/potluck 13 not found/i);
    });

    test('responds with correct status and message with bad body', async() => {
      let result = await request(server)
        .put('/api/potluck/2')
        .send({date: 'feb 3'});
      expect(result.status).toBe(400);
      expect(result.body.message).toMatch(/missing required name/i);
    });
  });

  describe('[DELETE] /api/potluck/:id', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .del('/api/potluck/2');
      expect(result.status).toBe(200);
      let potluck = result.body;
      expect(potluck.pid).toBe(2);
      expect(potluck.name).toBe('bobs birthday');
      expect(potluck.date).toBe('feb 2');
      expect(potluck.time).toBe('2pm');
      expect(potluck.location).toBe('2nd cherry st');
    });

    test('responds with correct status and message sad path', async() => {
      let result = await request(server)
        .del('/api/potluck/13');
      expect(result.status).toBe(404);
      expect(result.body.message).toMatch(/potluck 13 not found/i);
    });
  });
});

describe('test items endpoints', () => {
  describe('[POST] /:id/items', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .post('/api/potluck/3/items')
        .send({name: 'chips'});
      expect(result.status).toBe(201);
      let item = result.body;
      expect(item.item_id).toBe(5);
      expect(item.name).toBe('chips');
    });

    test('responds with correct status and message sad path', async() => {
      let result = await request(server)
        .post('/api/potluck/13/items')
        .send({name: 'none'});
      expect(result.status).toBe(404);
      expect(result.body.message).toMatch(/potluck 13 not found/i);
    });

    test('responds with correct status and message with bad body', async() => {
      let result = await request(server)
        .post('/api/potluck/3/items')
        .send({name: ''});
      expect(result.status).toBe(400);
      expect(result.body.message).toMatch(/missing required name/i);
    });
  });

  describe('[GET] /:id/items', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .get('/api/potluck/3/items');
      expect(result.status).toBe(200);
      let items = result.body;
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('chips');
    });

    test('responds with correct status and message sad path', async() => {
      let result = await request(server)
        .get('/api/potluck/13/items');
      expect(result.status).toBe(404);
      expect(result.body.message).toMatch(/potluck 13 not found/i);
    });
  });

  describe('[PUT] /:id/items/:item_id', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .put('/api/potluck/3/items/5')
        .send({name: 'foobar'});
      expect(result.status).toBe(200);
      let item = result.body;
      expect(item.item_id).toBe(5);
      expect(item.name).toBe('foobar');
    });

    test('responds with correct status and message sad path', async() => {
      let result = await request(server)
        .put('/api/potluck/3/items/15')
        .send({name: 'none'});
      expect(result.status).toBe(404);
      expect(result.body.message).toMatch(/item 15 not found/i);
    });

    test('responds with correct status and message with bad body', async() => {
      let result = await request(server)
        .put('/api/potluck/3/items/5')
        .send({name: ''});
      expect(result.status).toBe(400);
      expect(result.body.message).toMatch(/missing required name/i);
    });

    test('responds correctly when valid update responsible user', async() => {
      let result = await request(server)
        .put('/api/potluck/3/items/5')
        .send({name: 'foobar', responsible: 2});
      expect(result.status).toBe(200);
      let item = result.body;
      expect(item.responsible).toBe(2);
    });

    test('responds correctly when invalid update responsible user', async() => {
      let result = await request(server)
        .put('/api/potluck/3/items/5')
        .send({name: 'none', responsible: 13});
      expect(result.status).toBe(400);
      expect(result.body.message).toMatch(/invalid user/i);
    });
  });

  describe('[DELETE] /:id/items/:item_id', () => {
    test('responds with correct status and body happy path', async() => {
      let result = await request(server)
        .del('/api/potluck/3/items/5');
      expect(result.status).toBe(200);
      let item = result.body;
      expect(item.name).toBe('foobar');
    });

    test('responds with correct status and message sad path', async() => {
      let result = await request(server)
        .del('/api/potluck/3/items/15');
      expect(result.status).toBe(404);
      expect(result.body.message).toMatch(/item 15 not found/i);
    });
  });
});