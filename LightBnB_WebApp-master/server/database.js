const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
});

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

///////////////////////
const getUserWithEmail = function(email) {
let queryString = `
SELECT id, name, email, password FROM users
WHERE email = $1;
`
  return pool
  .query(queryString, [email])
  .then((result) => result.rows[0])
  .catch((err) => err.message);
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

////////////
const getUserWithId = function(id) {
let queryString = `
SELECT id, name, email, password FROM users 
WHERE id = $1;
`;
  return pool
  .query(queryString, [id])
  .then((result) => result.rows[0])
  .catch((err) => err.message);
};

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

////////////
const addUser =  function(user) {
let queryString = `
INSERT INTO usersS(name, email, password)
VALUES ($1, $2, $3)
RETURNING *;
`;
let values = [user.name, user.email, user.password]
  return pool
  .query(queryString, [values])
  .then((result) => result.rows[0])
  .catch((err) => err.message);
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}

// const getAllReservations = function(guest_id, limit = 10) {
// let queryString = `
// SELECT * FROM properties 
// WHERE guest_id $1
// LIMIT $2;
// `
// let values = [guest_id, limit]
// return pool
//   .query(queryString, [values])
//   .then((result) => result.rows)
//   .catch((err) => err.message);
// };

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  let queryString = `
  SELECT * FROM properties 
  LIMIT $1;
  `
  return pool
    .query(queryString, [limit])
    .then((result) => result.rows)
    .catch((err) => err.message);
  };

  // const getAllProperties = (options, limit = 10) => {
  //   return pool
  //     .query(`SELECT * FROM properties LIMIT $1`, [limit])
  //     .then((result) => {
  //       console.log('Properties');
  //       return result.rows
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };
  // getAllProperties().then(data => {
  //   return data
  // });
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;