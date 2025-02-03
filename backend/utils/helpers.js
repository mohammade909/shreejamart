const db = require("../config/database");

const createUser = (userFields, callback) => {
  const columns = Object.keys(userFields).join(", ");
  const values = Object.values(userFields);
  const placeholders = values.map(() => "?").join(", ");

  const query = `INSERT INTO users (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return callback(err, null);
    }
    callback(null, results);
  });
};
const createEntries = (table, userFields, callback) => {
  const columns = Object.keys(userFields).join(", ");
  const values = Object.values(userFields);
  const placeholders = values.map(() => "?").join(", ");

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = { createUser, createEntries };
