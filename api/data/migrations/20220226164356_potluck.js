/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('potluck', tbl => {
            tbl.increments('pid');
            tbl.string('name', 128).notNullable();
            tbl.string('date', 15);
            tbl.string('time', 15);
            tbl.string('location', 128);
            tbl.integer('user_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users');
        })
        .createTable('items', tbl => {
            tbl.increments('item_id');
            tbl.string('name', 128).notNullable();
            tbl.integer('responsible')
                .references('user_id')
                .inTable('users');
        })
        .createTable('org', tbl => {
            tbl.integer('pid')
                .unsigned()
                .notNullable()
                .references('pid')
                .inTable('potluck')
                .onDelete('CASCADE');
            tbl.integer('item_id')
                .unsigned()
                .notNullable()
                .references('item_id')
                .inTable('items')
                .onDelete('CASCADE');
            tbl.primary(['pid', 'item_id']);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('org')
        .dropTableIfExists('items')
        .dropTableIfExists('potluck');
};