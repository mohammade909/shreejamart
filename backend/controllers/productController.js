const db = require("../config/database"); // Import your database connection
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware"); // Middleware for async error handling
const path = require("path");
const fs = require("fs");
// Assuming you have a custom error handler

exports.createProduct = catchAsyncErrors(async (req, res) => {
  // Define createdPaths array outside try block so it's accessible in catch
  const createdPaths = [];

  try {
    // Start a database transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(new Error("Failed to start transaction"));
        resolve();
      });
    });

    const {
      name,
      description,
      price,
      unit_of_measurement,
      stock_quantity,
      category_id,
      brand_id,
      vendor_id,
      expiry_date,
      is_perishable,
      discount_percentage,
      status,
      weight,
      quantitiy,
    } = req.body;

    const featured_image = req.files?.featured_image;
    const other_images = req.files?.other_images;

    // Validate required fields
    if (
      !name ||
      !price ||
      !unit_of_measurement ||
      !stock_quantity ||
      !category_id ||
      !vendor_id
    ) {
      throw new Error("Required fields are missing.");
    }

    // Check vendor KYC status using transaction
    const vendorStatus = await new Promise((resolve, reject) => {
      db.query(
        "SELECT kyc_status FROM vendors WHERE vendor_id = ?",
        [vendor_id],
        (err, results) => {
          if (err) reject(new Error("Database error while checking vendor"));
          else if (results.length === 0) reject(new Error("Vendor not found"));
          else resolve(results[0].kyc_status);
        }
      );
    });

    if (vendorStatus.toLowerCase() !== "approved") {
      throw new Error("KYC not approved");
    }

    // Validate images
    if (!featured_image) {
      throw new Error("Featured image is required.");
    }

    if (!other_images || !Array.isArray(other_images)) {
      throw new Error("Other images are required.");
    }

    // Sanitize file names and product name
    const sanitizeFileName = (fileName) =>
      fileName.replace(/\s+/g, "_").replace(/[^\w\-_\.]/g, "");
    const sanitizedProductName = sanitizeFileName(name);

    // Create product folder
    const productFolderPath = path.join(
      __dirname,
      "../../shreejamart.com/products",
      sanitizedProductName
    );

    // Create product directory
    await fs.promises.mkdir(productFolderPath, { recursive: true });
    createdPaths.push(productFolderPath);

    // Upload featured image
    const featuredImagePath = path.join(
      productFolderPath,
      sanitizeFileName(featured_image.name)
    );
    await featured_image.mv(featuredImagePath);
    createdPaths.push(featuredImagePath);

    // Upload other images
    const otherImagesPaths = [];
    for (const otherImage of other_images) {
      const otherImagePath = path.join(
        productFolderPath,
        sanitizeFileName(otherImage.name)
      );
      await otherImage.mv(otherImagePath);
      createdPaths.push(otherImagePath);
      otherImagesPaths.push(
        `/products/${sanitizedProductName}/${sanitizeFileName(otherImage.name)}`
      );
    }

    // Prepare images JSON
    const images = {
      featured_image: `/products/${sanitizedProductName}/${sanitizeFileName(
        featured_image.name
      )}`,
      other_images: otherImagesPaths,
    };

    // Insert product into database using transaction
    const result = await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO products (
          name, description, original_price, unit_of_measurement, stock_quantity, 
          category_id, brand_id, vendor_id, images, expiry_date, weight, 
          quantitiy, is_perishable, discount_percentage, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        name,
        description || null,
        price,
        unit_of_measurement,
        stock_quantity,
        category_id,
        brand_id || null,
        vendor_id,
        JSON.stringify(images),
        expiry_date || null,
        weight || 0.0,
        quantitiy || 0.0,
        is_perishable ? true : false,
        discount_percentage || 0.0,
        status || "available",
      ];

      db.query(query, values, (err, result) => {
        if (err) reject(new Error("Failed to insert product"));
        else resolve(result);
      });
    });

    // If all operations successful, commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) reject(new Error("Failed to commit transaction"));
        resolve();
      });
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product_id: result.insertId,
    });
  } catch (error) {
    // Rollback transaction
    await new Promise((resolve) => {
      db.rollback(() => resolve());
    });

    // Clean up created files and directories
    for (const path of createdPaths.reverse()) {
      try {
        if (fs.existsSync(path)) {
          const stats = fs.statSync(path);
          if (stats.isDirectory()) {
            fs.rmdirSync(path, { recursive: true });
          } else {
            fs.unlinkSync(path);
          }
        }
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    // Send error response
    const statusCode =
      error.message.includes("Required fields") ||
      error.message.includes("not found") ||
      error.message.includes("KYC not approved")
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

exports.getAllProductsWithVendors = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const categoryId = req.query.category || null;
    const search = req.query.search || "";
    const status = req.query.status || "available";
    const sortOrder = req.query.sort || "newest";
    const vendorId = req.query.vendorId || null;

    // Build dynamic WHERE clause and values array
    let whereClause = [];
    const values = [];

    if (vendorId) {
      whereClause.push("p.vendor_id = ?");
      values.push(vendorId);
    } else {
      whereClause.push("p.status = ?");
      values.push(status);
    }

    if (categoryId) {
      const categoryArray = categoryId.split(",").map((id) => id.trim());
      const placeholders = categoryArray.map(() => "?").join(", ");
      whereClause.push(`p.category_id IN (${placeholders})`);
      values.push(...categoryArray);
    }
    if (search) {
      whereClause.push("p.name LIKE ?");
      values.push(`%${search}%`);
    }

    let orderBy = "p.created_at DESC"; // Default sorting
    if (sortOrder === "oldest") {
      orderBy = "p.created_at ASC";
    }

    // Join WHERE conditions using 'AND' if there are any
    const whereString =
      whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    const query = `
      SELECT 
        p.*, 
        v.vendor_name, 
        v.brand_details, 
        c.name AS category_name, 
        c.description AS category_description,
        AVG(rr.rating) AS average_rating,
        GROUP_CONCAT(rr.review_text SEPARATOR ' || ') AS reviews
      FROM products p
      LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN reviews_and_ratings rr 
        ON rr.entity_id = p.product_id AND rr.entity_type = 'products'
      ${whereString}
      GROUP BY p.product_id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?;
    `;

    values.push(limit, offset);

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error fetching products:", error);
        return next(new Error("Error fetching products and vendors"));
      }

      if (results.length === 0) {
        return res.status(200).json({
          success: true,
          products: [],
          pagination: {
            page,
            limit,
            totalProducts: 0,
            totalPages: 0,
          },
        });
      }

      const countQuery = `SELECT COUNT(DISTINCT p.product_id) AS total FROM products p ${whereString}`;
      db.query(countQuery, values.slice(0, -2), (countError, countResult) => {
        if (countError) {
          console.error("Error fetching product count:", countError);
          return next(new Error("Error fetching product count"));
        }

        const totalProducts = countResult[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        // Return response with product data and pagination info
        res.status(200).json({
          success: true,
          products: results,
          pagination: {
            page,
            limit,
            totalProducts,
            totalPages,
          },
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

exports.getProductById = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  try {
    const query = `
        SELECT p.*, v.vendor_id, v.vendor_name, v.brand_details AS brand_details,
         c.name AS category_name, c.description AS category_description
        FROM products p
        LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = ?;`;

    db.query(query, [productId], (error, results) => {
      if (error) {
        console.log(error);
        return next(new Error("Error fetching product details"));
      }

      // If no product is found
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Send the response with product and vendor details
      res.status(200).json({
        success: true,
        product: results[0],
      });
    });
  } catch (error) {
    next(error);
  }
});

exports.getVendorProducts = catchAsyncErrors(async (req, res, next) => {
  const { vendorId } = req.params;
  try {
    // Get page, limit, category, and sort order from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const categoryId = req.query.category_id || null; // Category filter (optional)
    const sortOrder = req.query.sort || "newest"; // Sorting by newest (default) or oldest

    // Build dynamic WHERE clause based on the filters
    let whereClause = `p.vendor_id = ${vendorId} AND p.status = 'available'`;

    if (categoryId) {
      whereClause += ` AND p.category_id = ${categoryId}`;
    }

    // Determine the sorting order based on the sort query parameter
    let orderBy = "p.created_at DESC"; // Default: newest first
    if (sortOrder === "oldest") {
      orderBy = "p.created_at ASC"; // Sort by oldest
    }

    // Query to get all products by a specific vendor
    const query = `
        SELECT p.*, v.vendor_id, v.vendor_name, v.brand_details AS brand_details,
         c.name AS category_name, c.description AS category_description
        FROM products p
        LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE ${whereClause}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?;`;

    db.query(query, [limit, offset], (error, results) => {
      if (error) {
        console.log(error);
        return next(new Error("Error fetching vendor products"));
      }

      // If no products found for the vendor
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for this vendor" });
      }

      // Get total count of products for the specific vendor
      const countQuery = `SELECT COUNT(*) AS total FROM products WHERE ${whereClause}`;

      db.query(countQuery, (countError, countResult) => {
        if (countError) {
          console.log(countError);
          return next(new Error("Error fetching vendor product count"));
        }

        const totalProducts = countResult[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        // Send the response with vendor products and pagination info
        res.status(200).json({
          success: true,
          data: results,
          pagination: {
            page,
            limit,
            totalProducts,
            totalPages,
          },
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;
    console.log(updateData);
    console.log(productId);
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    if (!Object.keys(updateData).length) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided for update" });
    }

    const setClause = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      setClause.push(`${key} = ?`);
      values.push(value);
    }

    values.push(productId);

    const query = `
      UPDATE products
      SET ${setClause.join(", ")}
      WHERE product_id = ?;
    `;

    db.query(query, values, (error, result) => {
      if (error) {
        console.error("Error updating product:", error);
        return next(new Error("Error updating product"));
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    });
  } catch (error) {
    next(error);
  }
});

exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  const { productId:product_id } = req.params;

  try {
    // Start database transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(new Error("Failed to start transaction"));
        resolve();
      });
    });

    // First get the product details to know which files to delete
    const productDetails = await new Promise((resolve, reject) => {
      db.query(
        "SELECT name, images FROM products WHERE product_id = ?",
        [product_id],
        (err, results) => {
          if (err) reject(new Error("Failed to fetch product details"));
          else if (results.length === 0) reject(new Error("Product not found"));
          else resolve(results[0]);
        }
      );
    });

    // Handle images data - it could be either a JSON string or an object
    const images = typeof productDetails.images === 'string' 
      ? JSON.parse(productDetails.images) 
      : productDetails.images;

    const sanitizeFileName = (fileName) =>
      fileName.replace(/\s+/g, "_").replace(/[^\w\-_\.]/g, "");
    const sanitizedProductName = sanitizeFileName(productDetails.name);

    // Get the product folder path
    const productFolderPath = path.join(
      __dirname,
      "../../shreejamart.com/products",
      sanitizedProductName
    );

    // Delete the product from the database using transaction
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM products WHERE product_id = ?",
        [product_id],
        (err, result) => {
          if (err) reject(new Error("Failed to delete product from database"));
          else if (result.affectedRows === 0) reject(new Error("Product not found"));
          else resolve();
        }
      );
    });

    // Commit the transaction
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) reject(new Error("Failed to commit transaction"));
        resolve();
      });
    });

    // After successful database deletion, delete the files
    try {
      if (fs.existsSync(productFolderPath)) {
        // Delete all files in the directory
        fs.rmdirSync(productFolderPath, { recursive: true });
      }
    } catch (fileError) {
      // Log file deletion error but don't fail the response since database deletion was successful
      console.error('Error deleting product files:', fileError);
    }

    res.status(200).json({
      success: true,
      message: "Product and associated files deleted successfully"
    });

  } catch (error) {
    // Rollback transaction
    await new Promise((resolve) => {
      db.rollback(() => resolve());
    });

    const statusCode = error.message.includes("not found") ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
});