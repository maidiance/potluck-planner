const db = require('../data/db-config');

module.exports = {
    find,
    findById,
    findByUser,
    insert,
    update,
    remove,
    findItems,
    insertItem,
    updateItem
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

async function remove(id) {
    const result = await findById(id);
    await db('potluck').where('pid', id).del();
    return result;
}

function findItems(potluck_id) {
    return db('org as o')
        .join('items as i', 'i.item_id', 'p.pid')
        .select('i.name')
        .where('p.pid', potluck_id);
}

function findItemById(potluck_id) {
    return db('items')
        .where('item_id', potluck_id);
}

async function insertItem(potluck_id, item) {
    const toInsert = {
        pid: potluck_id,
        item_id: item.item_id
    };
    await db('org')
        .insert(toInsert)
        .where('pid', potluck_id)
    return db('items')
        .insert(item)
        .then(([id]) => {
            return findItemById(id);
        })
}

async function updateItem(item_id, changes) {
    await db('items')
        .update(changes)
        .where('item_id', item_id);
    return findItemById(item_id);
}

async function removeItem(item_id) {
    const result = await findItemById(item_id);
    await db('items').where('item_id', item_id).del();
    return result;
}