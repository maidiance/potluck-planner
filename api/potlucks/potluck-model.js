const db = require('../data/db-config');
const Users = require('../users/user-model');

module.exports = {
    find,
    findById,
    findByUser,
    insert,
    update,
    remove,
    getAttendsByPotluck,
    addAttend,
    delAttend
};

function find() {
    return db('potluck as p')
        .leftJoin('users as u', 'u.user_id', 'p.user_id')
        .select('p.pid', 'u.user_id', 'username', 'name', 'date', 'time', 'location');
}

function findById(potluck_id) {
    return db('potluck as p')
        .leftJoin('users as u', 'u.user_id', 'p.user_id')
        .select('p.pid', 'u.user_id', 'username', 'name', 'date', 'time', 'location')
        .where('p.pid', potluck_id);
}

function findByUser(user_id) {
    return db('potluck as p')
        .leftJoin('users as u', 'u.user_id', 'p.user_id')
        .select('u.user_id', 'username', 'name', 'date', 'time', 'location')
        .where('p.user_id', user_id);
}

async function insert(potluck) {
    const [newPotluck] = await db('potluck').insert(potluck, ['pid', 'name', 'date', 'time', 'location']);
    return newPotluck;
}

async function update(potluck_id, changes) {
    await db('potluck')
        .update(changes)
        .where('pid', potluck_id);
    let [result] = await findById(potluck_id);
    return result;
}

async function remove(potluck_id) {
    const result = await findById(potluck_id);
    await db('potluck').where('pid', potluck_id).del();
    return result[0];
}

async function getAttendsByPotluck(potluck_id) {
    const users = await db('attending as a')
        .leftJoin('users as u', 'u.user_id', 'a.user_id')
        .select('u.user_id')
        .where('a.pid', potluck_id);
    const ids = users.map(user => {
        return user.user_id;
    });
    const result = await db('users')
        .select('username')
        .whereIn('user_id', ids);
    return result;
}

async function addAttend(potluck_id, user_id) {
    const toInsert = {pid: potluck_id, 'user_id': user_id};
    await db('attending').insert(toInsert, ['user_id']);
    let result = getAttendsByPotluck(potluck_id);
    return result;
}

async function delAttend(potluck_id, user_id) {
    const result = await Users.findById(user_id);
    await db('attending').where('user_id', user_id).del();
    return result;
}