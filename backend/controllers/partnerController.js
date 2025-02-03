const db = require("../config/database"); // Adjust to your database connection file
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware"); // Adjust to your error handler
const ErrorHandler = require("../utils/errorHandler"); // Custom error handler (optional)
const crypto = require("crypto")
const path = require("path");
const moment = require('moment'); 
const fs = require("fs");
// Get all partners with their user data
exports.getAllPartners = catchAsyncErrors(async (req, res) => {
  try {
    const { page = 1, limit = 10, kyc_status, partner_status } = req.query;
    const offset = (page - 1) * limit;

    // Initial query to fetch partners and their associated user and document data
    let query = `
      SELECT p.partner_id, p.user_id, p.delivery_zone, p.account_number, p.bank_name, p.ifsc_code,p.vehicle_model, p.vehicle_no, p.partner_status, p.wallet_balance, 
             p.kyc_status, p.created_at AS partner_created_at, p.updated_at AS partner_updated_at,
             u.firstname, u.lastname, u.username, u.email, u.phone_number, u.address,
             d.document_type, d.file_path, d.uploaded_at
      FROM partners p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN documents d ON p.user_id = d.user_id
      WHERE 1 = 1
    `;

    const queryParams = [];

    // Apply filters dynamically
    if (kyc_status) {
      query += ` AND p.kyc_status = ?`;
      queryParams.push(kyc_status);
    }

    if (partner_status) {
      query += ` AND p.partner_status = ?`;
      queryParams.push(partner_status);
    }

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    // Execute the main query
    db.query(query, queryParams, (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error fetching partners", error });
      }

      // Group documents for each partner
      const partnerMap = new Map();

      results.forEach((row) => {
        if (!partnerMap.has(row.partner_id)) {
          // Add partner information to the map
          partnerMap.set(row.partner_id, {
            partner_id: row.partner_id,
            user_id: row.user_id,
            bank:row.bank_name,
            account_number:row.account_number,
            ifsc_code: row.ifsc_code,
            delivery_zone: row.delivery_zone,
            partner_status: row.partner_status,
            wallet_balance: row.wallet_balance,
            kyc_status: row.kyc_status,
            vehicleModel: row.vehicle_model,
            vehicleNumber: row.vehicle_no,
            created_at: row.partner_created_at,
            updated_at: row.partner_updated_at,
            firstname: row.firstname,
            lastname: row.lastname,
            username: row.username,
            email: row.email,
            phone_number: row.phone_number,
            address: row.address,
            documents: [],
          });
        }

        // Add document information to the partner's documents array
        if (row.document_type && row.file_path) {
          partnerMap.get(row.partner_id).documents.push({
            document_type: row.document_type,
            file_path: row.file_path,
            uploaded_at: row.uploaded_at,
          });
        }
      });

      // Convert map to an array
      const partners = Array.from(partnerMap.values());

      // Pagination query to get the total count
      const totalCountQuery = `
        SELECT COUNT(*) as total
        FROM partners p
        WHERE 1 = 1
      `;

      db.query(totalCountQuery, queryParams.slice(0, queryParams.length - 2), (err, countResults) => {
        if (err) {
          return res.status(500).json({ message: "Error fetching total count", error: err });
        }

        const totalPartners = countResults[0].total;
        const totalPages = Math.ceil(totalPartners / parseInt(limit));

        res.status(200).json({
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalPartners,
            totalPages,
          },
          partners,
        });
      });
    });
  } catch (error) {
    console.error("Error getting partners:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Get a single partner by ID with user data
exports.getPartnerById = catchAsyncErrors(async (req, res) => {
  try {
    const { partner_id } = req.params;

    if (!partner_id) {
      return res.status(400).json({ message: "Partner ID is required" });
    }

    // Fetch partner data along with associated user details and group documents as an array
    const query = `
      SELECT p.partner_id, p.user_id, p.delivery_zone,p.account_number, p.bank_name, p.ifsc_code,p.vehicle_model, p.vehicle_no, p.partner_status, p.wallet_balance, 
             p.kyc_status, p.created_at, p.updated_at, 
             u.firstname, u.lastname, u.username, u.email, u.phone_number, u.address,
             d.document_type, d.file_path, d.uploaded_at
      FROM partners p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN documents d ON p.user_id = d.user_id
      WHERE p.partner_id = ?
    `;

    db.query(query, [partner_id], (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Error fetching partner", error });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Partner not found" });
      }

      // Group the documents into an array
      const partnerData = result[0];
      const documents = result.map(doc => ({
        document_type: doc.document_type,
        file_path: doc.file_path,
        uploaded_at: doc.uploaded_at
      }));

      // Remove document-related fields from the main partner data
      const { document_type, file_path, uploaded_at, ...partnerInfo } = partnerData;

      // Send the response with documents as an array
      res.status(200).json({
        ...partnerInfo,
        documents: documents
      });
    });
  } catch (error) {
    console.error("Error getting partner by ID:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

exports.getPartnerProfile = catchAsyncErrors(async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "Partner ID is required" });
    }

    // Fetch partner data along with associated user details and group documents as an array
    const query = `
      SELECT p.partner_id, p.user_id, p.delivery_zone,p.account_number, p.bank_name, p.ifsc_code,p.vehicle_model, p.vehicle_no, p.partner_status, p.wallet_balance, 
             p.kyc_status, p.created_at, p.updated_at, 
             u.firstname, u.lastname, u.username, u.email, u.phone_number, u.address,
             d.document_type, d.file_path, d.uploaded_at
      FROM partners p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN documents d ON p.user_id = d.user_id
      WHERE p.user_id = ?
    `;

    db.query(query, [user_id], (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Error fetching partner", error });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Partner not found" });
      }

      // Group the documents into an array
      const partnerData = result[0];
      const documents = result.map(doc => ({
        document_type: doc.document_type,
        file_path: doc.file_path,
        uploaded_at: doc.uploaded_at
      }));

      // Remove document-related fields from the main partner data
      const { document_type, file_path, uploaded_at, ...partnerInfo } = partnerData;

      // Send the response with documents as an array
      res.status(200).json({
        ...partnerInfo,
        documents: documents
      });
    });
  } catch (error) {
    console.error("Error getting partner by ID:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


exports.createPartner = catchAsyncErrors(async (req, res) => {
  try {
    const {
      password,
      email,
      firstname,
      lastname,
      phone_number,
      vehicle_model,
      vehicle_no,
      account_number,
      ifsc_code,
      bank_name,
    } = req.body;

    const drivingLicense = req.files?.driving_license;
    const bikeRc = req.files?.bike_rc;

    // Validate required fields
    if (
      !email ||
      !firstname ||
      !lastname ||
      !phone_number ||
      !vehicle_model ||
      !vehicle_no ||
      !account_number ||
      !ifsc_code ||
      !bank_name ||
      !drivingLicense ||
      !bikeRc
    ) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Generate a unique username
    const uniqueUsername = `${firstname + lastname}_${crypto
      .randomBytes(3)
      .toString("hex")}`;

    // Define folder path for partner documents
    const partnerFolderPath = path.join(
      __dirname,
      `../../frontend/public/partners/${uniqueUsername}`
    );

    if (!fs.existsSync(partnerFolderPath)) {
      fs.mkdirSync(partnerFolderPath, { recursive: true });
    }

    const documents = [
      { key: "driving_license", file: drivingLicense },
      { key: "bike_rc", file: bikeRc },
    ];

    const documentRecords = [];

    for (const doc of documents) {
      const sanitizedFileName = doc.file.name
        .replace(/\s+/g, "_")
        .replace(/[^\w\-_\.]/g, "");
      const documentPath = path.join(partnerFolderPath, sanitizedFileName);
      const publicPath = `/partners/${uniqueUsername}/${sanitizedFileName}`;

      // Move the file to the specified folder
      await new Promise((resolve, reject) => {
        doc.file.mv(documentPath, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Add the document record
      documentRecords.push({
        document_type: doc.key,
        file_path: publicPath,
        file_name: sanitizedFileName,
      });
    }

    // Insert user data into `users` table
    const userQuery = `
      INSERT INTO users (username, email, password, firstname, lastname, phone_number, user_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'delivery_partner', NOW(), NOW())
    `;

    db.query(
      userQuery,
      [uniqueUsername, email, password, firstname, lastname, phone_number],
      (userError, userResults) => {
        if (userError) {
          console.error(userError);
          return res
            .status(500)
            .json({ message: "Error creating user", error: userError });
        }

        const userId = userResults.insertId;

        // Insert partner data into `partners` table
        const partnerQuery = `
          INSERT INTO partners (user_id, account_number, ifsc_code, bank_name, vehicle_model, vehicle_no, kyc_status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?,  'pending', NOW(), NOW())
        `;

        db.query(
          partnerQuery,
          [
            userId,
            account_number,
            ifsc_code,
            bank_name,
            vehicle_model,
            vehicle_no,
          ],
          (partnerError, partnerResults) => {
            if (partnerError) {
              console.error(partnerError);
              return res.status(500).json({
                message: "Error creating partner",
                error: partnerError,
              });
            }

            // Insert document data into `documents` table
            const documentQuery = `
              INSERT INTO documents (user_id, document_type, file_path, file_name, uploaded_at)
              VALUES ?
            `;

            const documentValues = documentRecords.map((doc) => [
              userId,
              doc.document_type,
              doc.file_path,
              doc.file_name,
              new Date(),
            ]);

            db.query(documentQuery, [documentValues], (docError) => {
              if (docError) {
                console.error(docError);
                return res.status(500).json({
                  message: "Error saving documents",
                  error: docError,
                });
              }

              res.status(201).json({
                message: "Partner created successfully",
                user_id: userId,
                partner_id: partnerResults.insertId,
                uniqueUsername,
              });
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error creating partner:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Update a partner's details dynamically based on the provided fields
exports.updatePartner = catchAsyncErrors(async (req, res) => {
  
    try {
      const { partner_id } = req.params;
      const updateFields = req.body;
      
      if (!partner_id) {
        return res.status(400).json({ message: "Partner ID is required" });
      }
  
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No fields provided to update" });
      }
  
      // Start building the SET clause dynamically based on the fields sent in the request body
      const updates = [];
      const values = [];
  
      // Dynamically build the SQL query based on provided fields
      for (const [key, value] of Object.entries(updateFields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
  
      if (updates.length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
  
      // Add partner_id to the values array for the WHERE clause
      values.push(partner_id);
  
      // Construct the SQL query
      const query = `
        UPDATE partners 
        SET ${updates.join(', ')} 
        WHERE partner_id = ?
      `;
  
      // Execute the query to update the partner details
      db.query(query, values, (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error updating partner", error });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Partner not found" });
        }
  
        res.status(200).json({ message: "Partner updated successfully" });
      });
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
  

// Delete a partner
exports.deletePartner = catchAsyncErrors(async (req, res) => {
  try {
    const { partner_id } = req.params;

    if (!partner_id) {
      return res.status(400).json({ message: "Partner ID is required" });
    }

    const query = `DELETE FROM partners WHERE partner_id = ?`;

    db.query(query, [partner_id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error deleting partner", error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Partner not found" });
      }

      res.status(200).json({ message: "Partner deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting partner:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

exports.getPartnerEarnings = catchAsyncErrors(async (req, res) => {
  const { partnerId } = req.params;

  if (!partnerId) {
    return res.status(400).json({ message: "partnerId is required" });
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const queryTotalEarnings = `
    SELECT SUM(delivery_charge) AS total_earnings
    FROM orders
    WHERE partner_id = ? AND order_status = 'completed';
  `;

  const queryWeekEarnings = `
    SELECT SUM(delivery_charge) AS week_earnings
    FROM orders
    WHERE partner_id = ? AND order_status = 'completed' AND placed_at >= ?;
  `;

  const queryTodayEarnings = `
    SELECT SUM(delivery_charge) AS today_earnings
    FROM orders
    WHERE partner_id = ? AND order_status = 'completed' AND placed_at >= ?;
  `;

  try {
    // Fetch total earnings
    const totalResults = await new Promise((resolve, reject) => {
      db.query(queryTotalEarnings, [partnerId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].total_earnings || 0);
      });
    });

    // Fetch current week's earnings
    const weekResults = await new Promise((resolve, reject) => {
      db.query(queryWeekEarnings, [partnerId, startOfWeek], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].week_earnings || 0);
      });
    });

    // Fetch today's earnings
    const todayResults = await new Promise((resolve, reject) => {
      db.query(queryTodayEarnings, [partnerId, startOfToday], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].today_earnings || 0);
      });
    });

    res.status(200).json({
      totalEarnings: totalResults,
      currentWeekEarnings: weekResults,
      todayEarnings: todayResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching partner earnings",
      error,
    });
  }
});

// Make sure you install the moment library

exports.getPartnerOrderStats = catchAsyncErrors(async (req, res) => {
  const { partnerId } = req.params;

  if (!partnerId) {
    return res.status(400).json({ message: "partnerId is required" });
  }

  const queryCompletedOrders = `
    SELECT COUNT(*) AS completed_orders
    FROM orders
    WHERE partner_id = ? AND order_status = 'completed';
  `;

  const queryPendingOrders = `
    SELECT COUNT(*) AS pending_orders
    FROM orders
    WHERE partner_id = ? AND order_status = 'pending';
  `;

  const queryCancelledOrders = `
    SELECT COUNT(*) AS cancelled_orders
    FROM orders
    WHERE partner_id = ? AND order_status = 'cancelled';
  `;

  // Get today's date in 'YYYY-MM-DD' format
  const todayDate = moment().format('YYYY-MM-DD');

  const queryTodaysOrders = `
    SELECT * 
    FROM orders 
    WHERE partner_id = ? AND DATE(placed_at) = ? AND order_status = 'completed';
  `;

  try {
    // Fetch completed orders
    const completedResults = await new Promise((resolve, reject) => {
      db.query(queryCompletedOrders, [partnerId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].completed_orders || 0);
      });
    });

    // Fetch pending orders
    const pendingResults = await new Promise((resolve, reject) => {
      db.query(queryPendingOrders, [partnerId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].pending_orders || 0);
      });
    });

    // Fetch canceled orders
    const cancelledResults = await new Promise((resolve, reject) => {
      db.query(queryCancelledOrders, [partnerId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].cancelled_orders || 0);
      });
    });

    // Fetch today's completed orders
    const todaysOrders = await new Promise((resolve, reject) => {
      db.query(queryTodaysOrders, [partnerId, todayDate], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(200).json({
      completedOrders: completedResults,
      pendingOrders: pendingResults,
      cancelledOrders: cancelledResults,
      todaysOrders: todaysOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching partner order statistics",
      error,
    });
  }
});




// const buildQuery = (partnerId, limit, offset) => {
//   // Get current week's start and end dates using MySQL functions
//   const query = `
//     SELECT 
//       p.partner_id,
//       -- Current week earnings
//       COALESCE(SUM(
//         CASE 
//           WHEN o.placed_at >= DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
//           AND o.placed_at < DATE_ADD(DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY), INTERVAL 7 DAY)
//           THEN o.total_amount 
//           ELSE 0 
//         END
//       ), 0) as current_week_earnings,
      
//       -- Today's earnings
//       COALESCE(SUM(
//         CASE 
//           WHEN DATE(o.placed_at) = CURRENT_DATE
//           THEN o.total_amount 
//           ELSE 0 
//         END
//       ), 0) as today_earnings,
      
//       -- Current week delivery charges
//       COALESCE(SUM(
//         CASE 
//           WHEN o.placed_at >= DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
//           AND o.placed_at < DATE_ADD(DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY), INTERVAL 7 DAY)
//           THEN o.delivery_charge 
//           ELSE 0 
//         END
//       ), 0) as current_week_delivery_charges,
      
//       -- Current week completed orders count
//       COUNT(
//         CASE 
//           WHEN o.placed_at >= DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
//           AND o.placed_at < DATE_ADD(DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY), INTERVAL 7 DAY)
//           AND o.order_status = 'completed'
//           THEN 1 
//         END
//       ) as completed_orders_count,
      
//       -- Current week cancelled orders count
//       COUNT(
//         CASE 
//           WHEN o.placed_at >= DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
//           AND o.placed_at < DATE_ADD(DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY), INTERVAL 7 DAY)
//           AND o.order_status = 'cancelled'
//           THEN 1 
//         END
//       ) as cancelled_orders_count
//     FROM partners p
//     LEFT JOIN orders o ON p.partner_id = o.partner_id
//     WHERE p.partner_id = ?
//     GROUP BY p.partner_id;
//   `;

//   const recentOrdersQuery = `
//     SELECT 
//       order_id,
//       order_number,
//       total_amount,
//       order_status,
//       placed_at
//     FROM orders
//     WHERE partner_id = ?
//     AND placed_at >= DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
//     AND placed_at < DATE_ADD(DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY), INTERVAL 7 DAY)
//     ORDER BY placed_at DESC
//     LIMIT 5;
//   `;

//   return {
//     mainQuery: query,
//     recentOrdersQuery: recentOrdersQuery,
//     params: [partnerId]
//   };
// };

// const getTotalCount = (partnerId) => {
//   return new Promise((resolve, reject) => {
//     const countQuery = `
//       SELECT COUNT(*) as total
//       FROM partners
//       WHERE partner_id = ?;
//     `;

//     db.query(countQuery, [partnerId], (error, results) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       resolve(results[0].total);
//     });
//   });
// };

// exports.getPartnerStats = catchAsyncErrors(async (req, res) => {
//   const { partner_id } = req.params;
//   const page = parseInt(req.query.page || 1);
//   const limit = parseInt(req.query.limit || 10);
//   const offset = (page - 1) * limit;

//   if (!partner_id) {
//     return res.status(400).json({
//       success: false,
//       message: "Partner ID is required"
//     });
//   }

//   try {
//     const { mainQuery, recentOrdersQuery, params } = buildQuery(partner_id, limit, offset);

//     // Execute queries in parallel
//     const [stats, recentOrders, totalCount] = await Promise.all([
//       new Promise((resolve, reject) => {
//         db.query(mainQuery, params, (error, results) => {
//           if (error) reject(error);
//           else resolve(results);
//         });
//       }),
//       new Promise((resolve, reject) => {
//         db.query(recentOrdersQuery, params, (error, results) => {
//           if (error) reject(error);
//           else resolve(results);
//         });
//       }),
//       getTotalCount(partner_id)
//     ]);

//     if (!stats || stats.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Partner statistics not found"
//       });
//     }

//     const formattedResponse = {
//       partner_id: stats[0].partner_id,
//       earnings: {
//         current_week: parseFloat(stats[0].current_week_earnings || 0),
//         today: parseFloat(stats[0].today_earnings || 0),
//         delivery_charges: parseFloat(stats[0].current_week_delivery_charges || 0)
//       },
//       orders: {
//         completed: parseInt(stats[0].completed_orders_count || 0),
//         cancelled: parseInt(stats[0].cancelled_orders_count || 0)
//       },
//       recent_orders: recentOrders
//     };

//     const totalPages = Math.ceil(totalCount / limit);

//     return res.status(200).json({
//       success: true,
//       data: formattedResponse,
//       pagination: {
//         current_page: page,
//         total_pages: totalPages,
//         total_records: totalCount,
//         records_per_page: limit
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching partner statistics:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while fetching partner statistics"
//     });
//   }
// });