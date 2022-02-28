const users = [
  {username: 'bob', password: 'foobar'},
  {username: 'bloom', password: 'tech'},
  {username: 'lana', password: 'llama'},
];
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  return knex('users').insert(users);
};
