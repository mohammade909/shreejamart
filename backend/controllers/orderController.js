const db = require("../config/database"); // Assuming you have configured `mysql2` connection
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");




exports.createOrder = catchAsyncErrors(async (req, res) => {
  try {
    const {
      cart_id,
      userId,
      location,
      partner_id,
      subtotal,
      tax,
      gst,
      delivery_charge,
      discount,
      notes,
      total_amount,
      payment_status,
      payment_method,
      items,
    } = req.body;

    if (
      !userId ||
      !subtotal ||
      !total_amount ||
      !payment_status ||
      !payment_method ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields or items" });
    }

    // Generate unique order number
    const order_number = `#ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    

    // Insert order into orders table
    const createOrderQuery = `
      INSERT INTO orders (userId, order_number, location, partner_id, subtotal, tax, gst, delivery_charge, discount, notes, total_amount, payment_status, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [orderResult] = await db
      .promise()
      .execute(createOrderQuery, [
        userId,
        order_number,
        location,
        partner_id || null,
        subtotal,
        tax,
        gst,
        delivery_charge,
        discount,
        notes,
        total_amount,
        payment_status,
        payment_method,
      ]);

    const orderId = orderResult.insertId;

    // Insert items and update product quantities
    const insertItemQuery = `
      INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_description, price, quantity, item_total, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const updateProductQtyQuery = `
      UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?
    `;

    for (const item of items) {
      const {
        product_id,
        vendor_id,
        product_name,
        product_description,
        price,
        quantity,
        item_total,
        images,
      } = item;

      // Insert item into order_items table
      await db
        .promise()
        .execute(insertItemQuery, [
          orderId,
          product_id,
          vendor_id,
          product_name,
          product_description || null,
          price,
          quantity,
          item_total,
          JSON.stringify(images),
        ]);

      // Update product stock quantity
      await db.promise().execute(updateProductQtyQuery, [quantity, product_id]);
    }

    // Delete cart items and cart if cart_id is provided
    if (cart_id) {
      await db
        .promise()
        .execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cart_id]);
      await db
        .promise()
        .execute(`DELETE FROM carts WHERE cart_id = ?`, [cart_id]);
    }

    res.status(201).json({
      order_id: orderId,
      message: "Order and items created successfully, stock updated",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Controller to update an order
exports.updateOrder = catchAsyncErrors(async (req, res) => {
  const { order_id } = req.params;
  const updates = req.body;

  const currentTimestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  updates.updated_at = currentTimestamp;
  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const queryParams = [...Object.values(updates), order_id];

  const query = `UPDATE orders SET ${updateFields} WHERE order_id = ?`;
  await db.promise().execute(query, queryParams);

  if (updates.order_status === "completed") {
    // Fetch total amount for each vendor in the order
    const [vendorTotals] = await db.promise().execute(
      `
      SELECT 
        oi.vendor_id, 
        SUM(oi.item_total) AS total_amount
      FROM order_items oi
      WHERE oi.order_id = ?
      GROUP BY oi.vendor_id
      `,
      [order_id]
    );

    let adminCommission = 0;

    // Process vendor payments and admin commission
    for (const vendor of vendorTotals) {
      const vendor_id = vendor.vendor_id;
      const total_amount = vendor.total_amount;
      const commission = total_amount * 0.10; // 10% commission
      const vendor_amount = total_amount - commission; // Amount after deduction

      adminCommission += commission; // Accumulate admin commission

      // Deduct 10% and update vendor's wallet
      await db.promise().execute(
        `
        UPDATE vendors
        SET wallet_balance = wallet_balance + ?
        WHERE vendor_id = ?
        `,
        [vendor_amount, vendor_id]
      );
    }

    // Add accumulated commission to admin's wallet
    await db.promise().execute(
      `
      UPDATE users
      SET wallet_balance = wallet_balance + ?
      WHERE user_id = 1
      `,
      [adminCommission]
    );

    // Update partner wallet with delivery charge
    await db.promise().execute(
      `
      UPDATE partners p
      JOIN orders o ON p.partner_id = o.partner_id
      SET p.wallet_balance = p.wallet_balance + o.delivery_charge
      WHERE o.order_id = ?
      `,
      [order_id]
    );
  }

  res.status(200).json({ message: "Order updated successfully" });
});


// Import database connection
// exports.getAllOrders = catchAsyncErrors(async (req, res) => {
//   const { page = 1, limit = 10, dateFrom, dateTo, status, userId } = req.query;
//   const offset = (page - 1) * limit;

//   // Initialize query components for orders and order_items
//   let query = `
//     SELECT 
//       o.order_id, o.userId, o.order_number, o.location, o.partner_id, o.subtotal, 
//       o.tax, o.gst, o.delivery_charge, o.discount, o.notes, o.total_amount, 
//       o.payment_status, o.payment_method, o.order_status, o.placed_at,
//       oi.item_id, oi.product_id, oi.vendor_id, oi.product_name, oi.product_description, 
//       oi.price, oi.quantity, oi.item_total, oi.images, 
//       u.firstname, u.lastname, u.email, u.phone_number, u.address
//     FROM orders o
//     LEFT JOIN order_items oi ON o.order_id = oi.order_id
//     LEFT JOIN users u ON o.userId = u.user_id
//     WHERE 1 = 1`;

//   const queryParams = [];

//   // Apply filters dynamically
//   if (userId) {
//     query += ` AND o.userId = ?`;
//     queryParams.push(userId);
//   }

//   if (dateFrom) {
//     query += ` AND o.placed_at >= ?`;
//     queryParams.push(dateFrom);
//   }

//   if (dateTo) {
//     query += ` AND o.placed_at <= ?`;
//     queryParams.push(dateTo);
//   }

//   if (status) {
//     query += ` AND o.order_status = ?`;
//     queryParams.push(status);
//   }

//   query += ` LIMIT ? OFFSET ?`;
//   queryParams.push(parseInt(limit), parseInt(offset));

//   // Execute the query
//   db.query(query, queryParams, (error, results) => {
//     if (error) {
//       console.log(error);
//       return res
//         .status(500)
//         .json({ message: "Error retrieving orders", error });
//     }

//     // Format the results to group the order items under each order
//     const orders = results.reduce((acc, row) => {
//       const {
//         order_id,
//         userId,
//         order_number,
//         location,
//         partner_id,
//         subtotal,
//         tax,
//         gst,
//         delivery_charge,
//         discount,
//         notes,
//         total_amount,
//         payment_status,
//         payment_method,
//         order_status,
//         placed_at,
//         item_id,
//         product_id,
//         vendor_id,
//         product_name,
//         product_description,
//         price,
//         quantity,
//         item_total,
//         images,
//         firstname,
//         lastname,
//         email,
//         phone_number,
//         address,
//       } = row;

//       let order = acc.find((order) => order.order_id === order_id);

//       if (!order) {
//         order = {
//           order_id,
//           userId,
//           order_number,
//           location,
//           partner_id,
//           subtotal,
//           tax,
//           gst,
//           delivery_charge,
//           discount,
//           notes,
//           total_amount,
//           payment_status,
//           payment_method,
//           order_status,
//           placed_at,
//           user: {
//             firstname,
//             lastname,
//             email,
//             phone_number,
//             address,
//           },
//           items: [],
//         };
//         acc.push(order);
//       }

//       if (item_id) {
//         order.items.push({
//           item_id,
//           product_id,
//           vendor_id,
//           product_name,
//           product_description,
//           price,
//           quantity,
//           item_total,
//           images,
//         });
//       }

//       return acc;
//     }, []);

//     // Pagination data
//     let totalOrdersQuery = `
//       SELECT COUNT(*) as total
//       FROM orders o
//       WHERE 1 = 1`;

//     if (userId) {
//       totalOrdersQuery += ` AND o.userId = ?`;
//       queryParams.push(userId);
//     }

//     db.query(totalOrdersQuery, queryParams, (err, countResults) => {
//       if (err) {
//         console.log(err);
//         return res
//           .status(500)
//           .json({ message: "Error retrieving total count", error: err });
//       }

//       const totalOrders = countResults[0].total;
//       const totalPages = Math.ceil(totalOrders / parseInt(limit));

//       res.status(200).json({
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total: totalOrders,
//           totalPages,
//         },
//         orders,
//       });
//     });
//   });
// });


exports.getAllOrders = catchAsyncErrors(async (req, res) => {
  const { page = 1, limit = 10, dateFrom, dateTo, status, userId, partnerId } = req.query;
  const offset = (page - 1) * limit;
 
  // Initialize query components for orders and order_items
  let query = `
    SELECT 
      o.order_id, o.userId, o.order_number, o.location, o.partner_id, o.subtotal, 
      o.tax, o.gst, o.delivery_charge, o.discount, o.notes, o.total_amount, 
      o.payment_status, o.payment_method, o.order_status, o.placed_at,
      oi.item_id, oi.product_id, oi.vendor_id, oi.product_name, oi.product_description, 
      oi.price, oi.quantity, oi.item_total, oi.images, 
      u.firstname, u.lastname, u.email, u.phone_number, u.address
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN users u ON o.userId = u.user_id
    WHERE 1 = 1`;

  const queryParams = [];

  // Apply filters dynamically
  if (userId) {
    query += ` AND o.userId = ?`;
    queryParams.push(userId);
  }

  if (partnerId) {
    query += ` AND o.partner_id = ?`;
    queryParams.push(partnerId);
  }

  if (dateFrom) {
    query += ` AND o.placed_at >= ?`;
    queryParams.push(dateFrom);
  }

  if (dateTo) {
    query += ` AND o.placed_at <= ?`;
    queryParams.push(dateTo);
  }

  if (status) {
    query += ` AND o.order_status = ?`;
    queryParams.push(status);
  }

  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(limit), parseInt(offset));

  // Execute the query
  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error retrieving orders", error });
    }

    // Format the results to group the order items under each order
    const orders = results.reduce((acc, row) => {
      const {
        order_id,
        userId,
        order_number,
        location,
        partner_id,
        subtotal,
        tax,
        gst,
        delivery_charge,
        discount,
        notes,
        total_amount,
        payment_status,
        payment_method,
        order_status,
        placed_at,
        item_id,
        product_id,
        vendor_id,
        product_name,
        product_description,
        price,
        quantity,
        item_total,
        images,
        firstname,
        lastname,
        email,
        phone_number,
        address,
      } = row;

      let order = acc.find((order) => order.order_id === order_id);

      if (!order) {
        order = {
          order_id,
          userId,
          order_number,
          location,
          partner_id,
          subtotal,
          tax,
          gst,
          delivery_charge,
          discount,
          notes,
          total_amount,
          payment_status,
          payment_method,
          order_status,
          placed_at,
          user: {
            firstname,
            lastname,
            email,
            phone_number,
            address,
          },
          items: [],
        };
        acc.push(order);
      }

      if (item_id) {
        order.items.push({
          item_id,
          product_id,
          vendor_id,
          product_name,
          product_description,
          price,
          quantity,
          item_total,
          images,
        });
      }

      return acc;
    }, []);

    // Pagination data
    let totalOrdersQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      WHERE 1 = 1`;

    const totalParams = [];

    if (userId) {
      totalOrdersQuery += ` AND o.userId = ?`;
      totalParams.push(userId);
    }

    if (partnerId) {
      totalOrdersQuery += ` AND o.partner_id = ?`;
      totalParams.push(partnerId);
    }

    if (dateFrom) {
      totalOrdersQuery += ` AND o.placed_at >= ?`;
      totalParams.push(dateFrom);
    }

    if (dateTo) {
      totalOrdersQuery += ` AND o.placed_at <= ?`;
      totalParams.push(dateTo);
    }

    db.query(totalOrdersQuery, totalParams, (err, countResults) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error retrieving total count", error: err });
      }

      const totalOrders = countResults[0].total;
      const totalPages = Math.ceil(totalOrders / parseInt(limit));

      res.status(200).json({
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalOrders,
          totalPages,
        },
        orders,
      });
    });
  });
});



// Controller to get orders by vendor ID with pagination and filters
exports.getOrdersByVendor = catchAsyncErrors(async (req, res) => {
  const { vendor_id } = req.params;
  const {
    page = 1,
    limit = 10,
    dateFrom,
    dateTo,
    status,
    search,
    payment_status,
  } = req.query;
  const offset = (page - 1) * limit;

  if (!vendor_id) {
    return res.status(400).json({ message: "Vendor ID is required" });
  }

  // Base query to fetch orders and user details
  let baseQuery = `
    SELECT 
      o.order_id, o.userId, o.order_number, o.location, o.partner_id, 
      o.subtotal, o.tax, o.gst, o.delivery_charge, o.discount, o.notes, 
      o.total_amount, o.payment_status, o.payment_method, o.order_status, 
      o.placed_at, 
      oi.item_id, oi.product_id, oi.vendor_id, oi.product_name, 
      oi.product_description, oi.price, oi.quantity, oi.item_total, oi.images,
      u.user_id, u.firstname, u.lastname, u.username, u.email, u.phone_number, 
      u.address, u.user_type, u.wallet_balance, u.created_at AS user_created_at, 
      u.updated_at AS user_updated_at
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN users u ON o.userId = u.user_id
    WHERE o.vendor_id = ?`;

  let countQuery = `
    SELECT COUNT(DISTINCT o.order_id) AS totalOrders
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE oi.vendor_id = ?`;

  const queryParams = [vendor_id];
  const countParams = [vendor_id];

  // Apply optional filters
  if (dateFrom) {
    baseQuery += ` AND o.placed_at >= ?`;
    countQuery += ` AND o.placed_at >= ?`;
    queryParams.push(dateFrom);
    countParams.push(dateFrom);
  }

  if (dateTo) {
    baseQuery += ` AND o.placed_at <= ?`;
    countQuery += ` AND o.placed_at <= ?`;
    queryParams.push(dateTo);
    countParams.push(dateTo);
  }

  if (status) {
    baseQuery += ` AND o.order_status = ?`;
    countQuery += ` AND o.order_status = ?`;
    queryParams.push(status);
    countParams.push(status);
  }

  if (payment_status) {
    baseQuery += ` AND o.payment_status = ?`;
    countQuery += ` AND o.payment_status = ?`;
    queryParams.push(payment_status);
    countParams.push(payment_status);
  }

  if (search) {
    baseQuery += ` AND o.order_number LIKE ?`;
    countQuery += ` AND o.order_number LIKE ?`;
    queryParams.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }

  baseQuery += ` ORDER BY o.placed_at DESC LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(limit), parseInt(offset));

  // Fetch total count for pagination
  db.query(countQuery, countParams, (countError, countResult) => {
    if (countError) {
      console.error("Error fetching order count:", countError);
      return res.status(500).json({ message: "Error retrieving order count" });
    }

    const totalOrders = countResult[0].totalOrders;
    const totalPages = Math.ceil(totalOrders / limit);

    // Fetch paginated orders with user details
    db.query(baseQuery, queryParams, (error, results) => {
      if (error) {
        console.error("Error fetching vendor orders:", error);
        return res
          .status(500)
          .json({ message: "Error retrieving orders", error });
      }

      const orders = results.reduce((acc, row) => {
        const {
          order_id,
          userId,
          order_number,
          location,
          partner_id,
          subtotal,
          tax,
          gst,
          delivery_charge,
          discount,
          notes,
          total_amount,
          payment_status,
          payment_method,
          order_status,
          placed_at,
          item_id,
          product_id,
          vendor_id,
          product_name,
          product_description,
          price,
          quantity,
          item_total,
          images,
          user_id,
          firstname,
          lastname,
          username,
          email,
          phone_number,
          address,
          user_type,
          wallet_balance,
          user_created_at,
          user_updated_at,
        } = row;

        let order = acc.find((order) => order.order_id === order_id);

        if (!order) {
          order = {
            order_id,
            userId,
            order_number,
            location,
            partner_id,
            subtotal,
            tax,
            gst,
            delivery_charge,
            discount,
            notes,
            total_amount,
            payment_status,
            payment_method,
            order_status,
            placed_at,
            user: {
              user_id,
              firstname,
              lastname,
              username,
              email,
              phone_number,
              address,
              user_type,
              wallet_balance,
              created_at: user_created_at,
              updated_at: user_updated_at,
            },
            items: [],
          };
          acc.push(order);
        }

        if (item_id) {
          order.items.push({
            item_id,
            product_id,
            vendor_id,
            product_name,
            product_description,
            price,
            quantity,
            item_total,
            images,
          });
        }

        return acc;
      }, []);

      // Send the response
      res.status(200).json({
        success: true,
        orders,
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
          totalOrders,
          totalPages,
        },
      });
    });
  });
});



exports.getRecentUnassignedOrders = catchAsyncErrors(async (req, res) => {
  try {
    // Calculate the timestamp for five minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();


    // Query to fetch orders placed in the last 5 minutes with partner_id as NULL and include user details
    const query = `
      SELECT 
        o.order_id, o.userId, o.order_number, o.location, o.subtotal, o.tax, o.gst, 
        o.delivery_charge, o.discount, o.notes, o.total_amount, o.cosutmer_pin, 
        o.cancel_reason, o.payment_status, o.payment_method, o.order_status, o.placed_at,
        u.firstname, u.lastname, u.email, u.phone_number, u.address
      FROM orders o
      LEFT JOIN users u ON o.userId = u.user_id
      WHERE o.partner_id IS NULL AND o.created_at >= ?
    `;

    db.query(query, [fiveMinutesAgo], (error, results) => {
      if (error) {
        console.error("Error fetching recent unassigned orders:", error);
        return res.status(500).json({ message: "Failed to retrieve orders", error });
      }

      res.status(200).json({
        success: true,
        orders: results.map(order => ({
          order_id: order.order_id,
          userId: order.userId,
          order_number: order.order_number,
          location: order.location,
          subtotal: order.subtotal,
          tax: order.tax,
          gst: order.gst,
          delivery_charge: order.delivery_charge,
          discount: order.discount,
          notes: order.notes,
          total_amount: order.total_amount,
          cosutmer_pin: order.cosutmer_pin,
          cancel_reason: order.cancel_reason,
          payment_status: order.payment_status,
          payment_method: order.payment_method,
          order_status: order.order_status,
          placed_at: order.placed_at,
          user: {
            firstname: order.firstname,
            lastname: order.lastname,
            email: order.email,
            phone_number: order.phone_number,
            address: order.address,
          },
        })),
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "An unexpected error occurred", error });
  }
});



exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, status, payment_status, dateFrom, dateTo } = req.query;

  const offset = (page - 1) * limit;
  const queryParams = [];
  let whereClauses = [`o.userId = ?`];
  queryParams.push(userId);

  // Apply optional filters
  if (status) {
    whereClauses.push(`o.order_status = ?`);
    queryParams.push(status);
  }

  if (payment_status) {
    whereClauses.push(`o.payment_status = ?`);
    queryParams.push(payment_status);
  }

  if (dateFrom && dateTo) {
    whereClauses.push(`o.placed_at BETWEEN ? AND ?`);
    queryParams.push(dateFrom, dateTo);
  }

  const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  try {
    // Construct the query with optional filters
    const dataQuery = `
      SELECT o.*, oi.item_id, oi.product_id, oi.vendor_id, oi.product_name, oi.price, oi.quantity, oi.item_total 
      FROM orders o 
      LEFT JOIN order_items oi ON o.order_id = oi.order_id 
      ${whereClause} 
      ORDER BY o.placed_at DESC 
      LIMIT ? 
    `;

    // Append pagination parameters
    queryParams.push(parseInt(limit, 10));

    const [rows] = await db.promise().execute(dataQuery, queryParams);

    // Count query for total records
    const countQuery = `
      SELECT COUNT(DISTINCT o.order_id) AS total 
      FROM orders o 
      ${whereClause}
    `;
    const [countResult] = await db.promise().execute(countQuery, queryParams.slice(0, -2));

    return res.status(200).json({
      success: true,
      data: rows,
      totalRecords: countResult[0].total,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(countResult[0].total / limit),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};


exports.getOrderById = catchAsyncErrors(async (req, res) => {
  try {
    const { order_id } = req.params; // Get the order_id from the request parameters

    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Query to get the order and user details by order_id
    const getOrderQuery = `
      SELECT 
        o.order_id, o.userId, o.order_number, o.location, o.partner_id, o.subtotal, 
        o.tax, o.gst, o.delivery_charge, o.discount, o.notes, o.total_amount, 
        o.payment_status, o.payment_method, o.order_status, o.placed_at,
        u.firstname, u.lastname, u.email, u.phone_number, u.address
      FROM orders o
      LEFT JOIN users u ON o.userId = u.user_id
      WHERE o.order_id = ?
    `;

    // Execute the query to fetch order details
    const [order] = await db.promise().execute(getOrderQuery, [order_id]);

    if (!order || order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Query to get the products related to the specific order
    const getOrderItemsQuery = `
      SELECT item_id, product_id, vendor_id, product_name, product_description, 
             price, quantity, item_total, images
      FROM order_items
      WHERE order_id = ?
    `;

    // Execute the query to fetch the product details for the order
    const [orderItems] = await db
      .promise()
      .execute(getOrderItemsQuery, [order_id]);

    // Format the order response including the product details
    const orderDetails = {
      ...order[0],
      items: orderItems.map((item) => {
        let images = item.images;

        // Check if images is a string and try to parse it
        if (typeof images === "string") {
          try {
            images = JSON.parse(images);
          } catch (e) {
            console.error(`Error parsing images JSON: ${e.message}`);
            images = [];
          }
        }

        return {
          item_id: item.item_id,
          product_id: item.product_id,
          vendor_id: item.vendor_id,
          product_name: item.product_name,
          product_description: item.product_description,
          price: item.price,
          quantity: item.quantity,
          item_total: item.item_total,
          images: images, // Use the parsed or default value
        };
      }),
    };

    // Send the order, user, and product details in the response
    res.status(200).json({ order: orderDetails });
  } catch (error) {
    console.log(`Error fetching order and products by id: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

exports.getPendingOrdersByPartnerId = catchAsyncErrors(async (req, res, next) => {
  const { partner_id } = req.params;

  try {
    // SQL query to fetch pending orders with user info
    const query = `
      SELECT 
        o.order_id, o.userId, o.order_number, o.location, o.partner_id, 
        o.subtotal, o.tax, o.gst, o.delivery_charge, o.discount, 
        o.notes, o.total_amount, o.cosutmer_pin, o.cancel_reason, 
        o.payment_status, o.payment_method, o.order_status, o.placed_at, 
        o.created_at, 
        u.user_id, u.username, u.email, u.firstname, u.lastname, u.phone_number, u.user_type
      FROM 
        orders o
      INNER JOIN 
        users u ON o.userId = u.user_id
      WHERE 
        o.partner_id = ? AND o.order_status = 'pending' OR o.order_status = 'picked' OR o.order_status = 'transit'
    `;

    // Execute query
    db.query(query, [partner_id], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err.message });
      }

      // Return the results
      res.status(200).json({
        success: true,
        pendingOrders: results,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});