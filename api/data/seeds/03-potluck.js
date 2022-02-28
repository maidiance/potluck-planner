const potlucks = [
  {name: 'bobs potluck', date: 'feb 2', time: '2pm', location: '2nd cherry st', user_id: 1},
  {name: 'bloom celebration', date: 'mar 3', time: '3pm', location: '3rd apple ln', user_id: 2}
];
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  return knex('potluck').insert();
};
