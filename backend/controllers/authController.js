const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const sendToken = require("../utils/jwtToken");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const multer = require("multer");
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tubedev87@gmail.com",
    pass: "fipn xijp mame dmzj",
  },
});
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

exports.signup = catchAsyncErrors(async (request, response, next) => {
  const userFields = request.body;
 
  console.log(userFields);
  
  if (!userFields.phone_number || !userFields.password) {
    return response.status(400).json({
      message: "First name, last name, email, and password are required",
    });
  }

  try {
    // Check if the user already exists
    const queryCheckUser = "SELECT * FROM users WHERE phone_number = ?";
    const queryCheckEmail = "SELECT * FROM users WHERE email = ?";
    const valuesCheckUser = [userFields.phone_number];
    const valuesCheckEmail = [userFields.email];
    const rowsCheckUser = await executeQuery(queryCheckUser, valuesCheckUser);
    const rowsCheckEmail = await executeQuery(queryCheckEmail, valuesCheckEmail);

    if (rowsCheckUser.length > 0 || rowsCheckEmail.length > 0)  {
      return response.status(400).json({ message: "User already exists" });
    }

    // Generate a unique username
    // userFields.username = await generateUniqueUsername(
    //   userFields.phoneNumber,
    //   userFields.lastname
    // );

    // Hash the password
    // userFields.password = await bcrypt.hash(userFields.password, 10);

    // Prepare the dynamic query
    const columns = Object.keys(userFields).join(", ");
    const placeholders = Object.keys(userFields)
      .map(() => "?")
      .join(", ");
    const values = Object.values(userFields);

    const queryInsertUser = `
      INSERT INTO users (${columns}, created_at, updated_at)
      VALUES (${placeholders}, NOW(), NOW())
    `;

    await executeQuery(queryInsertUser, values);

    // Get the newly created user
    const queryGetUser = "SELECT * FROM users WHERE phone_number = ?";
    const rowsGetUser = await executeQuery(queryGetUser, [
      userFields.phone_number,
    ]);
    const newUser = rowsGetUser[0];

    // Create a JWT
    // response.status(201).json({ message: "Account Created successfully!" });

    sendToken(newUser, 201, response);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

exports.signin = catchAsyncErrors(async (request, response, next) => {
  const { identifier, password } = request.body;

  if (!identifier || !password) {
    return response
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const query = "SELECT * FROM users WHERE email = ? OR phone_number = ?";
    const values = [identifier, identifier];

    // Function to execute the query
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

    // Execute query to fetch user data
    const rows = await executeQuery(query, values);
    if (rows.length === 0) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

   
    if (user.password !== password) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    } else {
      const user = rows[0];
      sendToken(user, 200, response);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//  Log Out User
exports.signout = catchAsyncErrors(async (request, response, next) => {
  response.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  response.status(200).json({
    success: true,
    message: "Logout successfully !",
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedData = req.body;
  const { ...updatedFields } = updatedData;

  const updateFieldsString = Object.keys(updatedFields)
    .map((key) => `${key}="${updatedFields[key]}"`)
    .join(", ");

  const sql = `UPDATE users SET ${updateFieldsString} WHERE user_id = ${req.user.id};`;
  console.log(sql);
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during update:", err);
      next(new ErrorHandler("Error during update", 500));
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Update successful" });
    } else {
      next(new ErrorHandler("User not found or no changes applied", 404));
    }
  });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const ID = req.user.id;
  const sql = `SELECT * FROM users WHERE user_id = ${ID};`;
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error during profile retrieval:", err);
      return next(new ErrorHandler("Error during profile retrieval", 500));
    }

    if (result.length > 0) {
      const { password, ...rest } = result[0];
      res.status(200).json({ success: true, user: rest });
    } else {
      return next(new ErrorHandler("User not found", 404));
    }
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results, fields) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        if (results.length === 0) {
          return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];
        const resetToken = uuidv4();

        const jwtToken = jwt.sign(
          { id: user.user_id, resetToken },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        db.query(
          `UPDATE users SET reset_password_token = ?, reset_password_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE user_id = ?`,
          [jwtToken, user.user_id],
          async (error, results, fields) => {
            if (error) {
              return res.status(500).json({ message: error.message });
            }
            try {
              await transporter.sendMail({
                from: "school-managemen@gmail.com",
                to: email,
                subject: "Password Reset",
                html: `<p>Click <a href="http://localhost:3000/reset-password/${jwtToken}">here</a> to reset your password.</p>`,
              });

              res.status(200).json({
                message: "Reset token generated and sent to " + email,
              });
            } catch (error) {
              res.status(500).json({ message: error.message });
            }
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  try {
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and newPassword are required" });
    }

    const [results] = await db
      .promise()
      .query(
        "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expiry > NOW()",
        [token]
      );

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const teacher = results[0];

    await db
      .promise()
      .query(
        "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expiry = NULL WHERE user_id = ?",
        [hashedPassword, user.user_id]
      );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

exports.shutdownServer = catchAsyncErrors(async (req, res, next) => {
  const { message, status } = req.body;

  if (status === undefined) {
    return next(new ErrorHandler("Status is required", 400));
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE server_shutdown SET message = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
        [message, status]
      );

    if (result.affectedRows === 0) {
      return next(new ErrorHandler("No entry found with the given ID", 404));
    }

    res.status(200).json({
      message: "Shutdown message updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Error updating shutdown message", 500));
  }
});

exports.getServerStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const [shutdownStatus] = await db
      .promise()
      .query("SELECT * FROM server_shutdown WHERE id = 1");
    res.status(200).json({
      shutdown: shutdownStatus[0] || {},
    });
  } catch (error) {
    return next(new ErrorHandler("Error retrieving server status", 500));
  }
});

exports.getOrderMetrics = catchAsyncErrors(async (req, res, next) => {
  const { from_date, to_date } = req.query;

  // Default filters
  const filters = [];
  let whereClause = "WHERE 1 = 1";

  if (from_date && to_date) {
    whereClause += " AND placed_at BETWEEN ? AND ?";
    filters.push(from_date, to_date);
  }

  // Query to calculate metrics for all statuses with totals
  const query = `
    SELECT 
      COUNT(order_id) AS total_orders,
      SUM(total_amount) AS total_amount,
      SUM(delivery_charge) AS total_delivery_charges,
      SUM(subtotal * 0.1) AS total_commission, -- Assuming 10% commission
      order_status
    FROM orders
    ${whereClause}
    GROUP BY order_status WITH ROLLUP;
  `;

  const [results] = await db.promise().execute(query, filters);

  // Format the response
  const metrics = {
    overall: {}, // Totals for all statuses
    status_metrics: {}, // Individual metrics per status
  };

  results.forEach((row) => {
    if (row.order_status === null) {
      // Overall totals (ROLLUP row)
      metrics.overall = {
        total_orders: row.total_orders,
        total_amount: row.total_amount,
        total_delivery_charges: row.total_delivery_charges,
        total_commission: row.total_commission,
      };
    } else {
      // Metrics by status
      metrics.status_metrics[row.order_status] = {
        total_orders: row.total_orders,
        total_amount: row.total_amount,
        total_delivery_charges: row.total_delivery_charges,
        total_commission: row.total_commission,
      };
    }
  });

  // Respond with metrics
  res.status(200).json({ metrics });
});

exports.getDashboardMatrix = catchAsyncErrors(async (req, res, next) => {
  try {
    // Queries for aggregating data
    const queries = {
      totalVendors: "SELECT COUNT(*) AS total_vendors FROM vendors",
      totalUsers: "SELECT COUNT(*) AS total_users FROM users",
      totalProducts: "SELECT COUNT(*) AS total_products FROM products",
      totalOrders: "SELECT COUNT(*) AS total_orders FROM orders",
      totalSales:
        "SELECT SUM(total_amount) AS total_sales FROM orders WHERE order_status = 'completed'",
      totalRevenue: `
        SELECT 
          SUM(subtotal) AS total_revenue,
          SUM(delivery_charge) AS total_delivery_charges,
          SUM(discount) AS total_discounts 
        FROM orders WHERE order_status = 'completed'
      `,
      topCategories: `
        SELECT c.name, COUNT(p.product_id) AS product_count 
        FROM categories c 
        LEFT JOIN products p ON c.category_id = p.category_id 
        GROUP BY c.category_id 
        ORDER BY product_count DESC LIMIT 5
      `,
      recentOrders: `
        SELECT o.order_id, o.order_number, o.total_amount, o.order_status, o.placed_at, u.firstname, u.lastname 
        FROM orders o 
        JOIN users u ON o.userId = u.user_id 
        ORDER BY o.placed_at DESC LIMIT 10
      `,
      rejectedAndPendingCounts: `
        SELECT 
          COUNT(CASE WHEN status = 'reject' THEN 1 END) AS rejected_count,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count
        FROM products
      `,
    };

    // Run all queries in parallel
    const results = await Promise.all(
      Object.values(queries).map(
        (query) =>
          new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            });
          })
      )
    );

    // Map results to meaningful keys
    const response = {
      totalVendors: results[0][0].total_vendors,
      totalUsers: results[1][0].total_users,
      totalProducts: results[2][0].total_products,
      totalOrders: results[3][0].total_orders,
      totalSales: results[4][0].total_sales || 0,
      totalRevenue: {
        revenue: results[5][0].total_revenue || 0,
        deliveryCharges: results[5][0].total_delivery_charges || 0,
        discounts: results[5][0].total_discounts || 0,
      },
      topCategories: results[6],
      recentOrders: results[7],
      rejectedAndPendingCounts: {
        rejected: results[8][0].rejected_count || 0,
        pending: results[8][0].pending_count || 0,
      },
    };

    // Send the response
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
