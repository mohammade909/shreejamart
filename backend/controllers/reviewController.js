const connection = require("../config/database");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const ErrorHandler = require("../utils/errorHandler");

// Utility function to build insert query (similar to existing implementation)
const buildInsertQuery = (tableName, data) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
  return { query, values: Object.values(data) };
};

// Utility function to build update query (similar to existing implementation)
const buildUpdateQuery = (tableName, data, idField, idValue) => {
  const keys = Object.keys(data).filter(key => typeof data[key] !== "function");
  const setClause = keys.map(key => `${key} = ?`).join(", ");
  const values = keys.map(key => data[key]);
  values.push(idValue);

  return {
    query: `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = ?`,
    values,
  };
};

// Create a new review
exports.createReview = catchAsyncErrors(async (req, res, next) => {
  const reviewData = req.body;
  // Validate required fields
  if (!reviewData.entity_type || !reviewData.entity_id || !reviewData.user_id) {
    return next(new ErrorHandler("Missing required review fields", 400));
  }

  // Build and execute insert query
  const { query, values } = buildInsertQuery("reviews_and_ratings", reviewData);

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error creating review: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    res.status(201).json({
      message: "Review created successfully",
      reviewId: results.insertId,
    });
  });
});

// Get all reviews for a specific entity
exports.getReviewsByEntity = catchAsyncErrors(async (req, res, next) => {
  const { entity_type, entity_id } = req.params;
  const query = `
    SELECT 
      r.*,
      u.user_id,
      u.username, 
      u.email,
      u.user_type,
      u.created_at AS user_created_at,
      (
        SELECT COUNT(*) 
        FROM reviews_and_ratings 
        WHERE user_id = u.user_id
      ) AS total_user_reviews
    FROM 
      reviews_and_ratings r
    LEFT JOIN 
      users u ON r.user_id = u.user_id
    WHERE 
      r.entity_type = ? AND r.entity_id = ?
    ORDER BY 
      r.date_submitted DESC
  `;

  connection.query(query, [entity_type, entity_id], (err, results) => {
    if (err) {
      console.error("Error fetching reviews: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    
    // Calculate aggregate statistics
    const aggregateStats = {
      total_reviews: results.length,
      average_rating: results.length > 0 
        ? (results.reduce((sum, review) => sum + review.rating, 0) / results.length).toFixed(1)
        : 0
    };

    res.status(200).json({
      success: true,
      reviews: results,
      stats: aggregateStats
    });
  });
});

// Get a single review by ID
exports.getReviewById = catchAsyncErrors(async (req, res, next) => {
  const reviewId = req.params.id;
  const query = "SELECT * FROM reviews_and_ratings WHERE review_id = ?";

  connection.query(query, [reviewId], (err, results) => {
    if (err) {
      console.error("Error fetching review: " + err);
      return next(new ErrorHandler("Server Error", 500));
    }
    if (results.length === 0) {
      return next(new ErrorHandler("Review not found", 404));
    }
    res.status(200).json({ success: true, review: results[0] });
  });
});

// Update a review
exports.updateReview = catchAsyncErrors(async (req, res, next) => {
  const reviewId = req.params.id;
  let reviewData = { ...req.body };

  // Sanitize the incoming review data
  reviewData = Object.fromEntries(
    Object.entries(reviewData).filter(
      ([key, value]) => typeof value !== "function" && value !== undefined
    )
  );

  // Build and execute update query
  const { query, values } = buildUpdateQuery(
    "reviews_and_ratings",
    reviewData,
    "review_id",
    reviewId
  );

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating review: " + err);
      return next(new ErrorHandler("Server Error", 500));
    }
    res.status(200).json({ message: "Review updated successfully" });
  });
});

// Delete a review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const reviewId = req.params.id;
  const query = "DELETE FROM reviews_and_ratings WHERE review_id = ?";

  connection.query(query, [reviewId], (err, results) => {
    if (err) {
      console.error("Error deleting review: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    res.status(200).json({ message: "Review deleted successfully" });
  });
});

// Get average rating for an entity
exports.getAverageRating = catchAsyncErrors(async (req, res, next) => {
  const { entity_type, entity_id } = req.params;
  const query = `
    SELECT 
      AVG(rating) as average_rating, 
      COUNT(*) as total_reviews 
    FROM 
      reviews_and_ratings 
    WHERE 
      entity_type = ? AND entity_id = ?
  `;

  connection.query(query, [entity_type, entity_id], (err, results) => {
    if (err) {
      console.error("Error calculating average rating: " + err.stack);
      return next(new ErrorHandler("Server Error", 500));
    }
    res.status(200).json({ 
      success: true, 
      average_rating: results[0].average_rating || 0,
      total_reviews: results[0].total_reviews || 0
    });
  });
});

exports.getReviewsGroupedByEntityType = catchAsyncErrors(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default values for page and pageSize
  
  // Calculate offset
  const offset = (page - 1) * pageSize;

  const query = `
    SELECT 
        rr.review_id,
        rr.entity_type,
        rr.entity_id,
        rr.rating,
        rr.review_text,
        rr.date_submitted AS review_created_at,
        u.user_id,
        u.username,
        u.email,
        u.firstname,
        u.lastname,
        rr.entity_type
    FROM 
        reviews_and_ratings rr
    JOIN 
        users u ON rr.user_id = u.user_id
    WHERE 
        rr.entity_type IN ('products', 'partners', 'blogs')
    LIMIT ? OFFSET ?;
  `;
  
  connection.query(query, [parseInt(pageSize), parseInt(offset)], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query failed" });
    }

    // Initialize the arrays for product and partner reviews
    const productReviews = [];
    const partnerReviews = [];
    const blogsReviews = [];

    // Loop through the results and categorize the reviews into the correct array
    results.forEach(review => {
      const reviewData = {
        review_id: review.review_id,
        entity_id: review.entity_id,
        rating: review.rating,
        review: review.review_text,
        review_created_at: review.review_created_at,
        user_id: review.user_id,
        username: review.username,
        email: review.email,
        first_name: review.firstname,
        last_name: review.lastname,
      };

      if (review.entity_type === "products") {
        productReviews.push(reviewData);
      } else if (review.entity_type === "partners") {
        partnerReviews.push(reviewData);
      } else if (review.entity_type === "blogs") {
        blogsReviews.push(reviewData);
      }
    });

    // Query to get the total count of reviews for pagination
    const countQuery = `
      SELECT COUNT(*) AS totalReviews
      FROM reviews_and_ratings rr
      WHERE rr.entity_type IN ('products', 'partners');
    `;

    connection.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        console.log(countErr);
        return res.status(500).json({ error: "Error fetching total reviews count" });
      }

      const totalReviews = countResults[0].totalReviews;
      const totalPages = Math.ceil(totalReviews / pageSize);

      // Return the reviews and pagination info
      res.status(200).json({
        productReviews,
        partnerReviews,
        blogsReviews,
        pagination: {
          currentPage: parseInt(page),
          pageSize: parseInt(pageSize),
          totalReviews,
          totalPages
        }
      });
    });
  });
});


