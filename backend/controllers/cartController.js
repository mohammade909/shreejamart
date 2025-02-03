const db = require("../config/database"); // Adjust to your database connection file
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware"); // Adjust to your error handler
const ErrorHandler = require("../utils/errorHandler"); // Custom error handler (optional)


// Add a single item to the cart or create a new cart if it doesn't exist
// exports.addItemToCart = catchAsyncErrors(async (req, res, next) => {
//   const { user_id, product_id, quantity, price, vendorId } = req.body;

//   if (!user_id || !product_id || !quantity || !price) {
//     return next(new ErrorHandler("User ID, product details (ID, quantity, price) are required.", 400));
//   }

//   try {
    
//     const [existingCartResult] = await db
//       .promise()
//       .query("SELECT * FROM carts WHERE user_id = ?", [user_id]);

//     let cart_id;

//     if (existingCartResult.length === 0) {

//       const [newCartResult] = await db
//         .promise()
//         .query("INSERT INTO carts (user_id) VALUES (?)", [user_id]);
//       cart_id = newCartResult.insertId; 
//     } else {
      
//       cart_id = existingCartResult[0].cart_id;
//     }

//     const [existingCartItemResult] = await db
//       .promise()
//       .query("SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?", [
//         cart_id,
//         product_id,
//       ]);

//     if (existingCartItemResult.length > 0) {
   
//       await db.promise().query(
//         "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?",
//         [quantity, cart_id, product_id]
//       );

//       res.status(200).json({
//         success: true,
//         message: "Product quantity updated in cart successfully.",
//         cart_id,
//       });
//     } else {
//       // Step 6: Insert the new product into the cart
//       await db.promise().query(
//         "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
//         [cart_id, product_id, quantity, price]
//       );

//       res.status(201).json({
//         success: true,
//         message: "Product added to cart successfully.",
//         cart_id,
//       });
//     }
//   } catch (error) {
//     next(new ErrorHandler("Unable to add item to cart. Please try again later.", 500));
//   }
// });


exports.addItemToCart = catchAsyncErrors(async (req, res, next) => {
  const { user_id, product_id, quantity, price, vendorId } = req.body;

  if (!user_id || !product_id || !quantity || !price || !vendorId) {
    return next(
      new ErrorHandler("User ID, product details (ID, quantity, price, vendor ID) are required.", 400)
    );
  }

  try {
    // Step 1: Check if the user already has a cart
    const [existingCartResult] = await db
      .promise()
      .query("SELECT * FROM carts WHERE user_id = ?", [user_id]);

    let cart_id;

    if (existingCartResult.length === 0) {
      // Step 2: Create a new cart if no cart exists
      const [newCartResult] = await db
        .promise()
        .query("INSERT INTO carts (user_id) VALUES (?)", [user_id]);
      cart_id = newCartResult.insertId;
    } else {
      // Use the existing cart ID
      cart_id = existingCartResult[0].cart_id;
    }

    // Step 3: Check vendor consistency in the cart
    const [cartItemsResult] = await db
      .promise()
      .query("SELECT * FROM cart_items WHERE cart_id = ?", [cart_id]);

    if (cartItemsResult.length > 0) {
      const existingVendorId = cartItemsResult[0].vendor_id;

      if (existingVendorId !== vendorId) {
        // Clear the cart if vendor IDs are different
        await db.promise().query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);
      }
    }

    // Step 4: Check if the product already exists in the cart
    const [existingCartItemResult] = await db
      .promise()
      .query("SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?", [
        cart_id,
        product_id,
      ]);

    if (existingCartItemResult.length > 0) {
      // Update the quantity if the product already exists in the cart
      await db.promise().query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?",
        [quantity, cart_id, product_id]
      );

      res.status(200).json({
        success: true,
        message: "Product quantity updated in cart successfully.",
        cart_id,
      });
    } else {
      // Step 5: Insert the new product into the cart
      await db.promise().query(
        "INSERT INTO cart_items (cart_id, product_id, quantity, price, vendor_id) VALUES (?, ?, ?, ?, ?)",
        [cart_id, product_id, quantity, price, vendorId]
      );

      res.status(201).json({
        success: true,
        message: "Product added to cart successfully.",
        cart_id,
      });
    }
  } catch (error) {
    next(new ErrorHandler("Unable to add item to cart. Please try again later.", 500));
  }
});

// Get all carts
exports.getUserCart = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.params; // Get user_id from the request params

  if (!user_id) {
    return next(new ErrorHandler("User ID is required.", 400));
  }

  try {
    // Query to get cart details for the user, including cart items and product details
    const [cartDetails] = await db.promise().query(`
      SELECT c.cart_id, c.user_id, ci.cart_item_id, ci.product_id, ci.quantity, ci.price, 
             p.name, p.description, p.images, p.vendor_id
      FROM carts c
      LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.product_id
      WHERE c.user_id = ?
    `, [user_id]);

    // Check if the user has a cart
    if (cartDetails.length === 0 || !cartDetails[0].cart_id) {
      return res.status(200).json({
        success: true,
        cart: {}, // Return an empty object if no cart or items exist
      });
    }

    // Group items by cart_id to return a structured response
    const cart = {
      cart_id: cartDetails[0].cart_id,
      user_id: cartDetails[0].user_id,
      items: [], // Initialize an empty array for cart items
    };

    // Populate items array, filtering out rows with null cart_item_id
    cartDetails.forEach((item) => {
      if (item.cart_item_id) { // Only push valid items
        const itemTotal = item.price * item.quantity;
        cart.items.push({
          cart_item_id: item.cart_item_id,
          product_id: item.product_id,
          product_name: item.name,
          product_description: item.description,
          vendor_id: item.vendor_id,
          images: item.images,
          quantity: item.quantity,
          price: item.price,
          item_total: itemTotal, // Item total for this particular product
        });
      }
    });

    // If no valid items are present, return an empty cart
    if (cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        cart: {}, // Empty cart
      });
    }

    res.status(200).json({
      success: true,
      cart, // Return the cart and its items
    });
  } catch (error) {
    console.error(error);
    next(new ErrorHandler("Unable to fetch cart details. Please try again later.", 500));
  }
});

// Get a cart by ID
exports.getCartById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const [cart] = await db.promise().query("SELECT * FROM carts WHERE cart_id = ?", [id]);

    if (cart.length === 0) {
      return next(new ErrorHandler("Cart not found.", 404));
    }

    res.status(200).json({
      success: true,
      cart: cart[0],
    });
  } catch (error) {
    next(new ErrorHandler("Unable to fetch cart. Please try again later.", 500));
  }
});

// Delete a cart
exports.deleteCart = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query("DELETE FROM carts WHERE cart_id = ?", [id]);

    if (result.affectedRows === 0) {
      return next(new ErrorHandler("Cart not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully.",
    });
  } catch (error) {
    next(new ErrorHandler("Unable to delete cart. Please try again later.", 500));
  }
});

// Update a cart item
exports.updateCartItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // cart_item_id
  const { action , userId} = req.body; // INCREMENT or DECREMENT

  // Log action for debugging
  console.log(`Received action: ${action} for cart_item_id: ${id}`);

  try {
    // Validate action
    if (!["INCREMENT", "DECREMENT"].includes(action)) {
      return next(new ErrorHandler("Invalid action provided. Must be 'INCREMENT' or 'DECREMENT'.", 400));
    }

    // Determine the SQL query based on action
    let sql;
    if (action === "INCREMENT") {
      sql = "UPDATE cart_items SET quantity = quantity + 1 WHERE cart_item_id = ?";
    } else if (action === "DECREMENT") {
      sql = "UPDATE cart_items SET quantity = quantity - 1 WHERE cart_item_id = ? AND quantity > 1";
    }

    // Execute the query inside a try block
    db.query(sql, [id], (err, result) => {
      if (err) {
        throw new Error("Database error while updating cart item");
      }

      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return next(new ErrorHandler("Cart item not found or invalid quantity. No changes made.", 404));
      }

      // Success response
      res.status(200).json({
        success: true,
        message: `Cart item ${action === "INCREMENT" ? "incremented" : "decremented"} successfully`,
      });
    });
  } catch (error) {
    console.error(`Error updating cart item: ${error.message}`, error);

    // Handle specific errors
    if (error.message.includes("Database error")) {
      return next(new ErrorHandler("Error updating cart item. Please try again later.", 500));
    }

    // General fallback error
    return next(new ErrorHandler(error.message || "Something went wrong", 500));
  }
});



// Delete a cart item
exports.deleteCartItem = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id; // Cart ID from the request params

  const sql = "DELETE FROM cart_items WHERE cart_item_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return next(new ErrorHandler("Error deleting cart item", 500));
    }
    if (result.affectedRows === 0) {
      return next(new ErrorHandler("Cart item not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  });
});
