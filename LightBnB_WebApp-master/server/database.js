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

const getUserWithEmail = function(email) {

let queryString = `
SELECT id, name, email, password FROM users
WHERE email = $1;
`;

  return pool
  .query(queryString, [email])
  .then((result) => result.rows[0])
  .catch((err) => err.message);
};

exports.getUserWithEmail = getUserWithEmail;

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
const getAllReservations = function(guest_id, limit = 10) {

let queryString = `
SELECT reservations.*, properties.*, AVG(rating) AS average_rating 
FROM reservations 
JOIN properties ON property_id = properties.id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = $1 AND reservations.start_date < now()
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT $2;
`;

return pool
  .query(queryString, [guest_id, limit])
  .then((result) => result.rows)
  .catch((err) => err.message);
};


exports.getAllReservations = getAllReservations;

/// Properties
  const getAllProperties = function (options, limit = 10) {
    
    const queryParams = [];
    
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    } 
    if(options.ownerid) {
      queryParams.push(`${options.owner_id}`);
      queryString += `WHERE owner_id = $${queryParams.length}`;
    }
     if(options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `AND cost_per_night/100 >= $${queryParams.length}`;
    }
    if(options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `AND cost_per_night/100 <= $${queryParams.length}`;
    }
    if(options.minimum_rating) {
      queryParams.push(`${options.minimum_rating}`);
      queryString += `AND rating >= $${queryParams.length}`;
    }
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
    console.log(queryString, queryParams);
    return pool.query(queryString, queryParams).then((res) => {
      return res.rows });
  };
exports.getAllProperties = getAllProperties;

const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, 
  cover_photo_url, cost_per_night, street, city, province, post_code, 
  country, parking_spaces, number_of_bathrooms, number_of_bedrooms) 
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  const queryParams = [  
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  // console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => {
    return res.rows });
};
exports.addProperty = addProperty;