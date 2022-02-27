const db = require('../data/db-config');

module.exports = {
    find,
    findBy,
    insert
};

function find() {
    return db('users');
}

function findBy(filter) {
    return db('users').where(filter);
}

async function insert(user) {
    // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
    // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
    const [newUserObject] = await db('users').insert(user, ['user_id', 'username', 'password'])
    return newUserObject // { user_id: 7, username: 'foo', password: 'xxxxxxx' }
}