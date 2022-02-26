const db = require('../data/db-config');

module.exports = {
    find,
    findById,
    insert,
    update,
    remove,
    getPotluckItems
};

function find() {
    return db('potluck as p')
        .leftJoin('users as u', 'u.user_id', 'p.user_id')
        .select('u.user_id', 'username', 'name', 'date', 'time', 'location');
}

function findById(id) {
    return db('potluck as p')
        .leftJoin('users as u', 'u.user_id', 'p.user_id')
        .select('u.user_id', 'username', 'name', 'date', 'time', 'location')
        .where({ user_id : id });
}

function insert(potluck) {
    return db('potluck')
        .insert(potluck)
        .then(([id]) => {
            return findById(id);
        })
}

async function update(id, changes) {
    await db('potluck')
        .update(changes)
        .where('pid', id)
    return findById(id);
}

async function remove(id) {
    const result = await findById(id);
    await db('potluck').where('pid', id).del();
    return result;
}

function getPotluckItems(id) {
    return db('org as o')
        .join('items as i', 'i.item_id', 'p.id')
        .select('i.name')
        .where('p.id', id)
}