const db = require('../data/db-config');

module.exports = {
    find,
    findById,
    insert,
    update,
    remove
};


async function find(potluck_id) {
    let result = await db('org as o')
        .leftJoin('items as i', 'i.item_id', 'o.item_id')
        .select('i.name')
        .where('o.pid', potluck_id);
    return result;
}

function findById(item_id) {
    return db('items')
        .where('item_id', item_id)
        .first();
}

async function insert(potluck_id, item) {
    let [newItem] = await db('items').insert(item, ['item_id', 'name']);
    let toInsert = {pid: potluck_id, item_id: newItem.item_id};
    await db('org').insert(toInsert, ['pid', 'item_id']);
    return newItem;
}

async function update(item_id, changes) {
    await db('items')
        .update(changes)
        .where('item_id', item_id);
    return findById(item_id);
}

async function remove(item_id) {
    const result = await findById(item_id);
    await db('items').where('item_id', item_id).del();
    return result;
}