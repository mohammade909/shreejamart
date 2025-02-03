const db = require("../config/database");

const addTransaction = (transactionData) => {
  
  return new Promise((resolve, reject) => {
    // Extract column names and values from the transactionData object
    const columns = Object.keys(transactionData);
    const values = Object.values(transactionData);
    
    // Create placeholders for the values (e.g., ?, ?, ? for each value)
    const placeholders = columns.map(() => '?').join(', ');

    // Build the SQL query dynamically
    const transactionQuery = `
      INSERT INTO transactions (${columns.join(', ')})
      VALUES (${placeholders})
    `;

    // Execute the query
    db.query(transactionQuery, values, (err, result) => {
      if (err) {
        return reject(err); // Pass the error back if any
      }
      resolve(result); // Return the result if successful
    });
  });
};

module.exports = { addTransaction };
