const connection = require("../config/database");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");
const fs = require("fs");

const buildInsertQuery = (tableName, data) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
  return { query, values: Object.values(data) };
};

function buildUpdateQuery(tableName, data, idField, idValue) {
  const keys = Object.keys(data).filter(key => typeof data[key] !== "function");
  const setClause = keys.map(key => `${key} = ?`).join(", ");
  const values = keys.map(key => data[key]);
  values.push(idValue);

  return {
    query: `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = ?`,
    values,
  };
}


// Create a new blog
exports.createBlog = catchAsyncErrors(async (req, res, next) => {
  const blogData = req.body;
  // Check if a file is uploaded
  if (!req.files || !req.files.blog_image) {
    return next(new ErrorHandler("No file uploaded", 400));
  }

  const file = req.files.blog_image;

  // Validate file type and size if needed
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return next(new ErrorHandler("Invalid file type", 400));
  }

  // Generate a unique name for the file
  const fileName = `${Date.now()}-${file.name}`;

  // Define the path to save the file
  const uploadPath = path.join(
    __dirname,
    "..",
    "..",
    "shreejamart.com",
    "blogs",
    fileName
  );

  // Save the file to the specified directory
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error("Error saving file: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }

    // Add the file name to the blogData
    blogData.blog_image = `/blogs/${fileName}`; // Changed from image_url to blog_image

    // Build the insert query
    const { query, values } = buildInsertQuery("blogs", blogData);

    // Insert the blog data into the database
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error creating blog: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }
      res.status(201).json({
        message: "Blog created successfully",
        blogId: results.insertId,
      });
    });
  });
});

// Get all blogs
exports.getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || null;
    const status = req.query.status || null;

    // Build dynamic WHERE clause and values array
    let whereClause = [];
    const values = [];

    if (search) {
      whereClause.push("(blogs.title LIKE ? OR blogs.content LIKE ?)");
      values.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause.push("blogs.category = ?");
      values.push(category);
    }

    if (status) {
      whereClause.push("blogs.status = ?");
      values.push(status);
    }

    // Join WHERE conditions using 'AND' if there are any
    const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    // Query to fetch blogs with authors
    const query = `
      SELECT 
        blogs.blog_id, blogs.title, blogs.content, blogs.blog_excerpt, blogs.category, 
        blogs.author_id, blogs.created_at, blogs.updated_at, blogs.status, blogs.tags, blogs.blog_image,
        users.user_id, users.username, users.email, users.user_type, users.created_at AS user_created_at
      FROM 
        blogs 
      LEFT JOIN 
        users 
      ON 
        blogs.author_id = users.user_id
      ${whereString}
      LIMIT ? OFFSET ?;
    `;

    values.push(limit, offset);

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error fetching blogs: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }

      // Handle case where no blogs are found
      if (results.length === 0) {
        return res.status(200).json({
          success: true,
          blogs: [],
          pagination: {
            page,
            limit,
            totalBlogs: 0,
            totalPages: 0,
          },
        });
      }

      // Fetch total count of matching blogs for pagination
      const countQuery = `
        SELECT COUNT(*) AS totalBlogs 
        FROM blogs 
        ${whereString};
      `;
      connection.query(countQuery, values.slice(0, -2), (countErr, countResult) => {
        if (countErr) {
          console.error("Error fetching blog count: " + countErr.stack);
          return next(new ErrorHandler("Server Error", 500));
        }

        const totalBlogs = countResult[0].totalBlogs;
        const totalPages = Math.ceil(totalBlogs / limit);

        // Return response with blog data and pagination info
        res.status(200).json({
          success: true,
          blogs: results,
          pagination: {
            page,
            limit,
            totalBlogs,
            totalPages,
          },
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

// Get a single blog by ID
exports.getBlogById = catchAsyncErrors(async (req, res, next) => {
  const blogId = req.params.id;
  const query = "SELECT * FROM blogs WHERE blog_id=?";
  console.log(blogId);

  connection.query(query, [blogId], (err, results) => {
    if (err) {
      console.error("Error fetching blog: " + err);
      return next(new ErrorHandler("Server Error", 500));
    }
    if (results.length === 0) {
      return next(new ErrorHandler("Blog not found", 404));
    }
    res.status(200).json({ success: true, blog: results[0] });
  });
});

exports.getBlogByUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.user_id;
  const query = "SELECT * FROM blogs WHERE author_id=?";

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching blog: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    if (results.length === 0) {
      return next(new ErrorHandler("Blog not found", 404));
    }
    res.status(200).json({ success: true, blogs: results[0] });
  });
});

// Update a blog
exports.updateBlog = catchAsyncErrors(async (req, res, next) => {
  const blogId = req.params.id;
  let blogData = { ...req.body };

  // Sanitize the incoming blog data
  blogData = Object.fromEntries(
    Object.entries(blogData).filter(
      ([key, value]) => typeof value !== "function" && value !== undefined
    )
  );

  // Check if a file is uploaded
  if (req.files && req.files.blog_image) {
    const file = req.files.blog_image;

    // Validate file type and size if needed
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorHandler("Invalid file type", 400));
    }

    // Generate a unique name for the file
    const fileName = `${Date.now()}-${file.name}`;

    // Define the path to save the file
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "blogs",
      fileName
    );

    // Save the file to the specified directory
    file.mv(uploadPath, (err) => {
      if (err) {
        console.error("Error saving file: " + err.stack);
        return next(new ErrorHandler("Server Error", 500));
      }

      // Add the file name to the blogData
      blogData.image_url = fileName;

      // Proceed with updating the blog data in the database
      const { query, values } = buildUpdateQuery(
        "blogs",
        blogData,
        "blog_id",
        blogId
      );

      connection.query(query, values, (err, results) => {
        if (err) {
          console.log("Error updating blog 1: " + err);
          return next(new ErrorHandler("Server Error", 500));
        }
        res.status(200).json({ message: "Blog updated successfully" });
      });
    });
  } else {
    // If no file is uploaded, proceed with updating the blog data without changing the image
    const { query, values } = buildUpdateQuery(
      "blogs",
      blogData,
      "blog_id",
      blogId
    );

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Error updating blog 1: " + err);
        return next(new ErrorHandler("Server Error", 500));
      }
      res.status(200).json({ message: "Blog updated successfully" });
    });
  }
});


// Delete a blog
exports.deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blogId = req.params.id;
  const query = "DELETE FROM blogs WHERE blog_id=?";

  connection.query(query, [blogId], (err, results) => {
    if (err) {
      console.error("Error deleting blog: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  });
});
