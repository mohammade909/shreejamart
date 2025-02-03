const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const db = require("../config/database");

dotenv.config();

const executeQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
const generateUniqueUsername = async (firstName, lastName) => {
  const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  let username = baseUsername;
  let isUnique = false;
  let counter = 0;

  while (!isUnique) {
    const query = "SELECT * FROM users WHERE username = ?";
    const values = [username];
    const rows = await executeQuery(query, values);

    if (rows.length === 0) {
      isUnique = true;
    } else {
      counter += 1;
      username = `${baseUsername}${counter}`;
    }
  }

  return username;
};
exports.createUser = catchAsyncErrors(async (request, response) => {
  const userFields = request.body;
  const columns = Object.keys(userFields).join(", ");
  const values = Object.values(userFields);
  const placeholders = values.map(() => "?").join(", ");

  const query = `INSERT INTO users (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);

      return response.status(500).json({ message: "Internal server error" });
    }
    response
      .status(201)
      .json({ message: "User created successfully", userId: results.insertId });
  });
});

exports.updateUser = catchAsyncErrors(async (request, response) => {
  const userId = request.params.id;
  let userFields = request.body;

  userFields.username = await generateUniqueUsername(
    userFields.firstname,
    userFields.lastname
  );
  const columns = Object.keys(userFields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(userFields), userId];

  const updateQuery = `UPDATE users SET ${columns}, updated_at = NOW() WHERE user_id = ?`;

  db.query(updateQuery, values, (err, results) => {
    if (err) {
      console.log(err);
      
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return response.status(404).json({ message: "User not found" });
    }

    // Fetch the updated user information
    const selectQuery = `SELECT * FROM users WHERE user_id = ?`;
    db.query(selectQuery, [userId], (err, userResults) => {
      if (err) {
        return response
          .status(500)
          .json({ message: "Failed to fetch updated user information" });
      }
      if (userResults.length === 0) {
        return response
          .status(404)
          .json({ message: "User not found after update" });
      }

      response.status(200).json({
        message: "User updated successfully",
        user: userResults[0], // Sending the updated user data
      });
    });
  });
});

exports.deleteUser = catchAsyncErrors(async (request, response) => {
  const userId = request.params.id;
  const query = "DELETE FROM users WHERE user_id = ?";
  console.log("delete ");

  db.query(query, [userId], (err, results) => {
    if (err) {
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return response.status(404).json({ message: "User not found" });
    }
    response
      .status(200)
      .json({ id: userId, message: "User deleted successfully" });
  });
});

exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const { user_type, search, page = 1, limit = 10 } = req.query;
 console.log(req.query);
 
  const offset = (page - 1) * Number(limit);

  // Base query for users
  let query = "SELECT * FROM users WHERE 1 = 1";
  const queryParams = [];

  // Apply filters
  if (user_type) {
    query += " AND user_type = ?";
    queryParams.push(user_type);
  }

  if (search) {
    query += " AND (username LIKE ? OR email LIKE ?)";
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Pagination
  query += " LIMIT ? OFFSET ?";
  queryParams.push(Number(limit), parseInt(offset));

  // Execute query for users
  db.query(query, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users." });
    }

    // Metrics Query (to get total user count)
    let metricsQuery = "SELECT COUNT(*) AS total FROM users WHERE 1 = 1";
    const metricsQueryParams = [];

    // Apply filters to metrics query
    if (user_type) {
      metricsQuery += " AND user_type = ?";
      metricsQueryParams.push(user_type);
    }

    if (search) {
      metricsQuery += " AND (username LIKE ? OR email LIKE ?)";
      metricsQueryParams.push(`%${search}%`, `%${search}%`);
    }

    // Execute metrics query
    db.query(metricsQuery, metricsQueryParams, (metricsErr, metricsResults) => {
      if (metricsErr) {
        return res.status(500).json({ error: "Error calculating metrics.", metricsErr });
      }

      const totalUsers = metricsResults[0].total;
      const totalPages = Math.ceil(totalUsers / parseInt(limit));

      res.status(200).json({
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          totalPages,
        },
        users: results,
      });
    });
  });
});

exports.getUserById = catchAsyncErrors(async (request, response) => {
  const { id } = request.params;
  const query = `
    SELECT users.*, stores.store_name 
    FROM users 
    LEFT JOIN stores ON users.store_id = stores.store_id
    WHERE users.user_id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return response.status(404).json({ message: "User not found" });
    }
    response.status(200).json(results[0]);
  });
});

exports.getUserProfile = catchAsyncErrors(async (request, response) => {
  const userId = request.params.id;
  const query = "SELECT * FROM users WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      return response.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return response.status(404).json({ message: "User not found" });
    }
    response.status(200).json(results[0]);
  });
});

exports.getTotals = catchAsyncErrors(async (request, response) => {
  // Query to calculate total donations and total users
  const totalDonationsQuery =
    "SELECT SUM(amount) AS total_donations FROM donations";
  const totalUsersQuery = "SELECT COUNT(*) AS total_users FROM users";

  try {
    // Execute both queries asynchronously using Promise.all
    const [donationsResult, usersResult] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(totalDonationsQuery, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(totalUsersQuery, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      }),
    ]);

    // Extract the total donations and users count
    const totalDonations = donationsResult[0].total_donations || 0;
    const totalUsers = usersResult[0].total_users || 0;

    // Respond with the totals
    response.status(200).json({
      total_donations: totalDonations,
      total_users: totalUsers,
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
