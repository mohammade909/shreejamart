const db = require("../config/database"); // Import database connection
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware"); // Middleware for async error handling
const path = require("path");
const fs = require("fs");
// Create Vendor and User
exports.createVendor = catchAsyncErrors(async (req, res, next) => {
  const {
    vendor_name,
    email,
    address,
    store_name,
    registration_number,
    kyc_status,
    bank_account_details,
    brand_details,
    annual_turnover,
    monthly_turnover,
    phone_number,
    rating,
    total_sales,
    platform_fee_rate,
    login_status,
    first_name,
    last_name,
    password,
  } = req.body;

  const username = `${first_name}_${last_name}`;
  // Validate required fields
  if (
    !vendor_name ||
    !email ||
    !store_name ||
    !first_name ||
    !last_name ||
    !phone_number ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Vendor name, email, store name, first name, last name, username, and password are required.",
    });
  }

  try {
    // Insert into `users` table
    const userQuery = `
      INSERT INTO users (
        firstname, lastname, username, email, password, phone_number, address,
        user_type, wallet_balance, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const userValues = [
      first_name,
      last_name,
      username,
      email,
      password,
      phone_number || null,
      address || null,
      "vendor", // User type as 'vendor'
      0, // Initial wallet balance
    ];

    const [userResult] = await db.promise().query(userQuery, userValues);
    const userId = userResult.insertId;

    // Insert into `vendors` table, including the user_id
    const vendorQuery = `
      INSERT INTO vendors (
        user_id, vendor_name, email, phone, address, store_name, registration_number, 
        kyc_status, bank_account_details, brand_details, annual_turnover, 
        monthly_turnover, rating, total_sales, platform_fee_rate, login_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const vendorValues = [
      userId, // Associate the vendor with the user
      vendor_name,
      email,
      phone_number || null,
      address || null,
      store_name,
      registration_number || null,
      kyc_status || "pending",
      JSON.stringify(bank_account_details) || null,
      JSON.stringify(brand_details) || null,
      annual_turnover || 0,
      monthly_turnover || 0,
      rating || 0,
      total_sales || 0,
      platform_fee_rate || 3.0,
      login_status || "active",
    ];

    const [vendorResult] = await db.promise().query(vendorQuery, vendorValues);
    const vendorId = vendorResult.insertId;

    res.status(201).json({
      success: true,
      message: "Vendor and user created successfully.",
      vendor_id: vendorId,
      user_id: userId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists.",
      });
    }

    next(error); // Pass other errors to the error handling middleware
  }
});
// Get all vendors with user details
exports.getAllVendors = catchAsyncErrors(async (req, res, next) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      sort = "newest",
      search = "",
      status = "",
      kycStatus = "", // New parameter for KYC status filtering
    } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Determine sorting order
    const orderBy =
      sort === "newest" ? "v.created_at DESC" : "v.created_at ASC";

    // Construct base query
    let query = `
      SELECT 
        v.vendor_id,
        v.user_id,
        v.vendor_name,
        v.email AS vendor_email,
        v.phone AS vendor_phone,
        v.address,
        v.store_name,
        v.registration_number,
        v.kyc_status,
        v.bank_account_details,
        v.brand_details,
        v.annual_turnover,
        v.monthly_turnover,
        v.rating,
        v.total_sales,
        v.platform_fee_rate,
        v.login_status,
        v.created_at AS vendor_created_at,
        v.updated_at AS vendor_updated_at,
        u.username AS user_username,
        u.email AS user_email,
        u.firstname AS user_firstname,
        u.lastname AS user_lastname,
        u.user_type AS role,
        u.created_at AS user_created_at,
        u.updated_at AS user_updated_at
      FROM vendors v
      LEFT JOIN users u ON v.user_id = u.user_id
      WHERE 1=1
    `;

    // Initialize params array
    let params = [];

    // Add search condition for both vendor_name and store_name
    if (search) {
      query += ` AND (v.vendor_name LIKE ? OR v.store_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Add KYC status filter
    if (kycStatus) {
      query += ` AND v.kyc_status = ?`;
      params.push(kycStatus);
    }

    // Add status filter
    if (status) {
      query += ` AND v.login_status = ?`;
      params.push(status);
    }

    // Add ordering and pagination
    query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    // Execute query
    db.query(query, params, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database query error",
          error: err,
        });
      }

      // Construct count query with same filters
      let countQuery = `
        SELECT COUNT(*) AS total 
        FROM vendors v 
        WHERE 1=1
      `;

      let countParams = [];

      // Add same filters to count query
      if (search) {
        countQuery += ` AND (v.vendor_name LIKE ? OR v.store_name LIKE ?)`;
        countParams.push(`%${search}%`, `%${search}%`);
      }

      if (kycStatus) {
        countQuery += ` AND v.kyc_status = ?`;
        countParams.push(kycStatus);
      }

      if (status) {
        countQuery += ` AND v.login_status = ?`;
        countParams.push(status);
      }

      // Execute count query
      db.query(countQuery, countParams, (countErr, countResults) => {
        if (countErr) {
          console.log(countErr);
          return res.status(500).json({
            success: false,
            message: "Database count query error",
            error: countErr,
          });
        }

        const totalVendors = countResults[0].total;

        res.status(200).json({
          success: true,
          vendors: results,
          pagination: {
            total: totalVendors,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalVendors / limit),
          },
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
exports.getVendorById = catchAsyncErrors(async (req, res, next) => {
  try {
    const { vendor_id } = req.params; // Extract the vendor_id from URL params

    // Construct query to fetch vendor by ID
    const query = `
      SELECT 
        v.vendor_id, 
        v.user_id, 
        v.vendor_name, 
        v.email AS vendor_email, 
        v.phone AS vendor_phone, 
        v.address, 
        v.store_name, 
        v.registration_number, 
        v.kyc_status, 
        v.bank_account_details, 
        v.brand_details, 
        v.annual_turnover, 
        v.monthly_turnover, 
        v.rating, 
        v.total_sales, 
        v.platform_fee_rate, 
        v.login_status, 
        v.created_at AS vendor_created_at, 
        v.updated_at AS vendor_updated_at, 
        u.username AS user_username, 
        u.email AS user_email, 
        u.firstname AS user_firstname, 
        u.lastname AS user_lastname, 
        u.user_type AS role, 
        u.created_at AS user_created_at, 
        u.updated_at AS user_updated_at
      FROM vendors v
      LEFT JOIN users u ON v.user_id = u.user_id
      WHERE v.vendor_id = ?; -- Fetch vendor by ID
    `;

    // Execute the query to fetch vendor details
    db.query(query, [vendor_id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database query error",
          error: err,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      // Return vendor details
      res.status(200).json({
        success: true,
        vendor: results[0], // The results array will contain only one vendor based on vendor_id
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

exports.getVendorProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const { user_id } = req.params; // Extract the vendor_id from URL params

    // Construct query to fetch vendor by ID
    const query = `
      SELECT 
        v.vendor_id, 
        v.user_id, 
        v.vendor_name, 
        v.email AS vendor_email, 
        v.phone AS vendor_phone, 
        v.address, 
        v.store_name, 
        v.registration_number, 
        v.kyc_status, 
        v.bank_account_details, 
        v.brand_details, 
        v.annual_turnover, 
        v.monthly_turnover, 
        v.rating, 
        v.total_sales, 
        v.platform_fee_rate, 
        v.wallet_balance, 
        v.login_status, 
        v.created_at AS vendor_created_at, 
        v.updated_at AS vendor_updated_at, 
        u.username AS user_username, 
        u.email AS user_email, 
        u.firstname AS user_firstname, 
        u.lastname AS user_lastname, 
        u.user_type AS role, 
        u.created_at AS user_created_at, 
        u.updated_at AS user_updated_at
      FROM vendors v
      LEFT JOIN users u ON v.user_id = u.user_id
      WHERE v.user_id = ?; -- Fetch vendor by ID
    `;

    // Execute the query to fetch vendor details
    db.query(query, [user_id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database query error",
          error: err,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      // Return vendor details
      res.status(200).json({
        success: true,
        vendor: results[0], // The results array will contain only one vendor based on vendor_id
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

exports.updateVendor = catchAsyncErrors(async (req, res, next) => {
  try {
    const { vendor_id } = req.params;
    console.log(vendor_id);
    const fieldsToUpdate = req.body;

    if (!Object.keys(fieldsToUpdate).length && !req.files) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const queryParts = [];
    const values = [];

    // Handle nested fields
    if (fieldsToUpdate.bank_account_details) {
      fieldsToUpdate.bank_account_details = JSON.stringify(
        fieldsToUpdate.bank_account_details
      );
      queryParts.push(`bank_account_details = ?`);
      values.push(fieldsToUpdate.bank_account_details);
    }

    if (fieldsToUpdate.brand_details) {
      // Parse if it's already a string to avoid double-stringifying
      if (typeof fieldsToUpdate.brand_details === 'string') {
        try {
          fieldsToUpdate.brand_details = JSON.parse(fieldsToUpdate.brand_details);
        } catch (e) {
          // If it's not a valid JSON string, keep it as-is
        }
      }
    
      if (req.files && req.files.logo_url) {
        const logoFile = req.files.logo_url;
        const uploadDir = path.join(__dirname, "../../frontend/public/brands/");
    
        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const uploadPath = path.join(uploadDir, logoFile.name);
    
        // Move file to uploads folder
        await logoFile.mv(uploadPath);
        fieldsToUpdate.brand_details.logo_url = `/brands/${logoFile.name}`;
      }
    
      // Now stringify the object
      fieldsToUpdate.brand_details = JSON.stringify(fieldsToUpdate.brand_details);
      queryParts.push(`brand_details = ?`);
      values.push(fieldsToUpdate.brand_details);
    }
    

    // Handle other fields dynamically
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (key !== "bank_account_details" && key !== "brand_details") {
        queryParts.push(`${key} = ?`);
        values.push(value);
      }
    }

    // Add updated_at field
    queryParts.push("updated_at = NOW()");
    const query = `UPDATE vendors SET ${queryParts.join(
      ", "
    )} WHERE user_id = ?`;
    values.push(vendor_id);

    // Execute the query
    db.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database query error",
          error: err,
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Vendor updated successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete vendor
exports.deleteVendor = catchAsyncErrors(async (req, res, next) => {
  try {
    const { vendor_id } = req.params;

    const query = `DELETE FROM vendors WHERE vendor_id = ?`;

    db.query(query, [vendor_id], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database query error",
          error: err,
        });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      res.status(200).json({
        success: true,
        message: "Vendor deleted successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

exports.getVendorMetrics = catchAsyncErrors(async (req, res) => {
  const { vendor_id } = req.params;

  if (!vendor_id) {
    return res.status(400).json({ message: "Vendor ID is required" });
  }

  try {
    // Main query for vendor metrics
    const [metrics] = await db.promise().execute(
      `
      SELECT 
          COALESCE(SUM(o.total_amount), 0) AS total_sales,
          COUNT(DISTINCT o.order_id) AS total_orders,
          COUNT(DISTINCT p.product_id) AS total_products,
          COUNT(CASE WHEN p.stock_quantity > 0 THEN 1 END) AS active_products,
          COUNT(CASE WHEN p.stock_quantity = 0 THEN 1 END) AS out_of_stock_products,
          COALESCE(SUM(p.price * p.stock_quantity), 0) AS total_stock_value,
          COALESCE(SUM(p.stock_quantity), 0) AS total_stock_quantity
      FROM 
          products p
      LEFT JOIN 
          orders o ON p.vendor_id = o.vendor_id
      WHERE 
          p.vendor_id = ?
      `,
      [vendor_id]
    );

    // Query for recent 5 orders
    const [recentOrders] = await db.promise().execute(
      `
      SELECT 
          o.order_id,
          o.order_number,
          o.total_amount,
          o.placed_at,
          o.payment_status,
          o.order_status
      FROM 
          orders o
      WHERE 
          o.vendor_id = ?
      ORDER BY 
          o.placed_at DESC
      LIMIT 5
      `,
      [vendor_id]
    );

    // Response
    return res.status(200).json({
      metrics: metrics[0],
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching vendor metrics:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});
