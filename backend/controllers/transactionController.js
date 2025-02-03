const db = require("../config/database"); // Adjust to your database connection file
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware"); // Adjust to your error handler
const ErrorHandler = require("../utils/errorHandler");
 // Custom error handler (optional)
exports.createTransaction = catchAsyncErrors(async (req, res, next) => {
  const {
    user_id,
    amount,
    payment_method,
    transactionType,
    reference_id,
    description,
    password,
  } = req.body;

  const txnNo = `#TXN-${Math.random().toString(36).substr(2, 6).toUpperCase()}${Math.floor(Math.random() * 10)}`;

  // Validate input
  if (!user_id || !amount || !payment_method || !transactionType || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields are missing" });
  }

  const connection = db; // Use the existing connection
  let walletBalance = 0;
  let userType;

  try {
    // Begin transaction
    await connection.promise().beginTransaction();

    // Check if user exists and fetch user details
    const [userRows] = await connection
      .promise()
      .query(
        "SELECT user_type, password AS storedPassword FROM users WHERE user_id = ?",
        [user_id]
      );

    if (userRows.length === 0) {
      throw new Error("User not found");
    }

    const user = userRows[0];
    userType = user.user_type;

    // Validate password
    if (password !== user.storedPassword) {
      throw new Error("Invalid user ID or password");
    }

    // Fetch wallet balance based on user type
    if (userType === "vendor") {
      const [vendorRows] = await connection
        .promise()
        .query("SELECT wallet_balance FROM vendors WHERE user_id = ?", [
          user_id,
        ]);
      if (vendorRows.length === 0) {
        throw new Error("Vendor not found");
      }
      walletBalance = vendorRows[0].wallet_balance;
    } else if (userType === "delivery_partner") {
      const [partnerRows] = await connection
        .promise()
        .query("SELECT wallet_balance FROM partners WHERE user_id = ?", [
          user_id,
        ]);
      if (partnerRows.length === 0) {
        throw new Error("Delivery partner not found");
      }
      walletBalance = partnerRows[0].wallet_balance;
    } else {
      throw new Error("Invalid user type for transaction");
    }

    
    // Perform withdraw or deposit based on transaction type
    if (transactionType === "withdraw") {
      // Ensure sufficient balance for withdrawal
      if (amount >walletBalance) {
        throw new Error("Insufficient wallet balance");
      }
      walletBalance -= amount; // Deduct balance for withdrawal
    } else if (transactionType === "deposit") {
      walletBalance += amount; // Increase balance for deposit
    } else {
      throw new Error("Invalid transaction type");
    }

    // Update wallet balance in the database
    if (userType === "vendor") {
      await connection
        .promise()
        .query("UPDATE vendors SET wallet_balance = ? WHERE user_id = ?", [
          walletBalance,
          user_id,
        ]);
    } else if (userType === "delivery_partner") {
      await connection
        .promise()
        .query("UPDATE partners SET wallet_balance = ? WHERE user_id = ?", [
          walletBalance,
          user_id,
        ]);
    }

    // Insert transaction record into the transactions table
    await connection
      .promise()
      .query(
        "INSERT INTO transactions (txn_no, user_id, amount, payment_method, reference_id, description, transactionType, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          txnNo,
          user_id,
          amount,
          payment_method,
          reference_id,
          description,
          transactionType,
          transactionType === "withdraw" ? "pending" : "complete",
        ]
      );

    // Commit transaction
    await connection.promise().commit();

    return res
      .status(201)
      .json({ success: true, message: "Transaction processed successfully" });
  } catch (error) {
    // Rollback transaction in case of error
    await connection.promise().rollback();

    console.error("Error during transaction:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during the transaction",
    });
  }
});

// Get transactions by user ID with filters, search, and pagination
exports.getTransactionsByUserId = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.params;
  const {
    startDate,
    endDate,
    status,
    minAmount,
    maxAmount,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  
  
  const offset = (page - 1) * limit;

  // Initialize query components for transactions
  let query = `
      SELECT 
        t.*,
        u.firstname, u.lastname, u.email, u.phone_number
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.user_id
      WHERE t.user_id = ?`;

  const queryParams = [user_id];

  // Add filters dynamically
  if (startDate && endDate) {
    query += ` AND t.created_at BETWEEN ? AND ?`;
    queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
  }

  
  if (status) {
    query += ` AND t.status = ?`;
    queryParams.push(status);
  }

  if (minAmount && maxAmount) {
    query += ` AND t.amount BETWEEN ? AND ?`;
    queryParams.push(minAmount, maxAmount);
  }

  if (search) {
    query += ` AND (t.description LIKE ? OR t.reference_id LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Pagination
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(limit), parseInt(offset));

  // Execute the query
  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error retrieving transactions", error });
    }

    if (results.length === 0) {
      return res.status(200).json({
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages:0,
        },
        matrix:{},
        transactions: [],
      });
    }

    // Pagination data for total count
    let totalQuery = `
        SELECT COUNT(*) as total
        FROM transactions t
        WHERE t.user_id = ?`;

    const totalQueryParams = [user_id];

    if (startDate && endDate) {
      totalQuery += ` AND t.created_at BETWEEN ? AND ?`;
      totalQueryParams.push(startDate, endDate);
    }
    if (status) {
      totalQuery += ` AND t.status = ?`;
      totalQueryParams.push(status);
    }
    if (minAmount && maxAmount) {
      totalQuery += ` AND t.amount BETWEEN ? AND ?`;
      totalQueryParams.push(minAmount, maxAmount);
    }
    if (search) {
      totalQuery += ` AND (t.description LIKE ? OR t.reference_id LIKE ?)`;
      totalQueryParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total transactions for pagination
    db.query(totalQuery, totalQueryParams, (err, countResults) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error retrieving total count", error: err });
      }

      const totalTransactions = countResults[0].total;
      const totalPages = Math.ceil(totalTransactions / parseInt(limit));

      // Calculate user matrix
      let matrixQuery = `
          SELECT 
            COUNT(t.transaction_id) AS total_transactions,
            SUM(t.amount) AS total_amount,
            AVG(t.amount) AS average_amount,
            MAX(t.amount) AS max_transaction,
            MIN(t.amount) AS min_transaction
          FROM transactions t
          WHERE t.user_id = ?`;

      const matrixQueryParams = [user_id];

      if (startDate && endDate) {
        matrixQuery += ` AND t.created_at BETWEEN ? AND ?`;
        matrixQueryParams.push(startDate, endDate);
      }
      if (status) {
        matrixQuery += ` AND t.status = ?`;
        matrixQueryParams.push(status);
      }
      if (minAmount && maxAmount) {
        matrixQuery += ` AND t.amount BETWEEN ? AND ?`;
        matrixQueryParams.push(minAmount, maxAmount);
      }
      if (search) {
        matrixQuery += ` AND (t.description LIKE ? OR t.reference_id LIKE ?)`;
        matrixQueryParams.push(`%${search}%`, `%${search}%`);
      }

      // Execute matrix query
      db.query(matrixQuery, matrixQueryParams, (matrixErr, matrixResults) => {
        if (matrixErr) {
          console.log(matrixErr);
          return res
            .status(500)
            .json({ message: "Error calculating user matrix", error: matrixErr });
        }

        const matrix = matrixResults[0];

        res.status(200).json({
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalTransactions,
            totalPages,
          },
          matrix,
          transactions: results,
        });
      });
    });
  });
});

// Get all transactions (Admin only) with filters, search, and pagination
exports.getAllTransactions = catchAsyncErrors(async (req, res, next) => {
  const {
    startDate,
    endDate,
    status,
    minAmount,
    maxAmount,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * Number(limit);
  
  
  // Base query for transactions
  let query = `
    SELECT 
      t.*,
      u.firstname, u.lastname, u.email, u.phone_number
    FROM transactions t
    LEFT JOIN users u ON t.user_id = u.user_id
    WHERE 1 = 1`;

  const queryParams = [];

  // Apply filters
  if (startDate && endDate) {
    query += ` AND t.created_at BETWEEN ? AND ?`;
    queryParams.push(startDate, endDate);
  }

  if (status) {
    query += ` AND t.status = ?`;
    queryParams.push(status);
  }

  if (minAmount && maxAmount) {
    query += ` AND t.amount BETWEEN ? AND ?`;
    queryParams.push(minAmount, maxAmount);
  }

  if (search) {
    query += ` AND (t.description LIKE ? OR t.reference_id LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Pagination
  query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;  // Order by created_at DESC
  queryParams.push(Number(limit), parseInt(offset));

  // Execute query for transactions
  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error retrieving transactions", error });
    }

    if (results.length === 0) {
      return res.status(200).json({
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages:0,
        },
        matrix:{},
        transactions: [],
      });
    }

    // Metrics Query
    let metricsQuery = `
      SELECT 
        COUNT(*) AS totalTransactions,
        SUM(amount) AS totalAmount,
        AVG(amount) AS averageAmount,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completedCount,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failedCount
      FROM transactions t
      WHERE 1 = 1`;

    const metricsQueryParams = [];

    if (startDate && endDate) {
      metricsQuery += ` AND t.created_at BETWEEN ? AND ?`;
      metricsQueryParams.push(startDate, endDate);
    }
    if (status) {
      metricsQuery += ` AND t.status = ?`;
      metricsQueryParams.push(status);
    }
    if (minAmount && maxAmount) {
      metricsQuery += ` AND t.amount BETWEEN ? AND ?`;
      metricsQueryParams.push(minAmount, maxAmount);
    }
    if (search) {
      metricsQuery += ` AND (t.description LIKE ? OR t.reference_id LIKE ?)`;
      metricsQueryParams.push(`%${search}%`, `%${search}%`);
    }

    // Execute Metrics Query
    db.query(metricsQuery, metricsQueryParams, (err, metricsResults) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error calculating metrics", error: err });
      }

      const metrics = metricsResults[0];

      // Total Transactions Count for Pagination
      let totalQuery = `
        SELECT COUNT(*) AS total
        FROM transactions t
        WHERE 1 = 1`;

      const totalQueryParams = [];

      if (startDate && endDate) {
        totalQuery += ` AND t.created_at BETWEEN ? AND ?`;
        totalQueryParams.push(startDate, endDate);
      }
      if (status) {
        totalQuery += ` AND t.status = ?`;
        totalQueryParams.push(status);
      }
      if (minAmount && maxAmount) {
        totalQuery += ` AND t.amount BETWEEN ? AND ?`;
        totalQueryParams.push(minAmount, maxAmount);
      }
      if (search) {
        totalQuery += ` AND (t.description LIKE ? OR t.reference_id LIKE ?)`;
        totalQueryParams.push(`%${search}%`, `%${search}%`);
      }

      // Execute Total Transactions Count Query
      db.query(totalQuery, totalQueryParams, (err, countResults) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Error retrieving total count", error: err });
        }

        const totalTransactions = countResults[0].total;
        const totalPages = Math.ceil(totalTransactions / parseInt(limit));

 
        
        res.status(200).json({
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalTransactions,
            totalPages,
          },
          metrics: {
            totalTransactions: metrics.totalTransactions,
            totalAmount: metrics.totalAmount,
            averageAmount: metrics.averageAmount,
            pendingCount: metrics.pendingCount,
            completedCount: metrics.completedCount,
            failedCount: metrics.failedCount,
          },
          transactions: results,
        });
      });
    });
  });
});


// Update a transaction
exports.updateTransaction = catchAsyncErrors(async (req, res, next) => {
  const { transaction_id } = req.params;
  const { status } = req.body;
console.log();

  // Validate input
  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });
  }

  const result = await db
    .promise()
    .query("UPDATE transactions SET status = ? WHERE transaction_id = ?", [
      status,
      transaction_id,
    ]);

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  }

  return res
    .status(200)
    .json({ success: true, message: "Transaction updated successfully" });
});
