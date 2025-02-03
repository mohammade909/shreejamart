const db = require("../config/database");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const ErrorHandler = require("../utils/errorHandler");

// Create a comment or review
exports.createComment = catchAsyncErrors(async (req, res, next) => {
  const { content_type, content_id, comment_text, rating, parent_comment_id } = req.body;
  const user_id = req.params.user_id;

  if (!content_type || !content_id || !comment_text) {
    return next(new ErrorHandler("Content type, content ID, and comment text are required.", 400));
  }

  // Validate content type
  if (!['product', 'blog_post'].includes(content_type)) {
    return next(new ErrorHandler("Invalid content type.", 400));
  }

  // Validate rating if provided
  if (rating && (rating < 1 || rating > 5)) {
    return next(new ErrorHandler("Rating must be between 1 and 5.", 400));
  }

  try {
    // Check if content exists
    const [contentExists] = await db.promise().query(
      `SELECT 1 FROM ${content_type}s WHERE id = ?`,
      [content_id]
    );

    if (!contentExists.length) {
      return next(new ErrorHandler(`${content_type} not found.`, 404));
    }

    // Insert comment
    await db.promise().query(
      `INSERT INTO comments 
       (user_id, content_type, content_id, comment_text, rating, parent_comment_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, content_type, content_id, comment_text, rating || null, parent_comment_id || null]
    );

    res.status(201).json({
      success: true,
      message: "Comment created successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler("Unable to create comment. Please try again later.", 500));
  }
});

// Get comments for specific content
exports.getComments = catchAsyncErrors(async (req, res, next) => {
  const { content_type, content_id } = req.params;

  if (!content_type || !content_id) {
    return next(new ErrorHandler("Content type and content ID are required.", 400));
  }

  try {
    if (content_type === 'product') {
      // Get rating statistics for products
      const [stats] = await db.promise().query(
        `SELECT 
          COUNT(*) as total_reviews,
          AVG(rating) as average_rating,
          COUNT(DISTINCT user_id) as unique_reviewers
        FROM comments 
        WHERE content_type = ? 
        AND content_id = ? 
        AND rating IS NOT NULL`,
        [content_type, content_id]
      );

      // Get comments with user info and reply count
      const [comments] = await db.promise().query(
        `SELECT 
          c.*, 
          u.username,
          (SELECT COUNT(*) 
           FROM comments replies 
           WHERE replies.parent_comment_id = c.id) as reply_count
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.content_type = ? 
        AND c.content_id = ?
        ORDER BY 
          c.parent_comment_id IS NULL DESC,
          c.created_at DESC`,
        [content_type, content_id]
      );

      res.status(200).json({
        success: true,
        stats: stats[0],
        comments,
      });
    } else {
      const [comments] = await db.promise().query(
        `SELECT 
          c.*, 
          u.username,
          (SELECT COUNT(*) 
           FROM comments replies 
           WHERE replies.parent_comment_id = c.id) as reply_count
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.content_type = ? 
        AND c.content_id = ?
        ORDER BY 
          c.parent_comment_id IS NULL DESC,
          c.created_at DESC`,
        [content_type, content_id]
      );

      res.status(200).json({
        success: true,
        comments,
      });
    }
  } catch (error) {
    console.log(error);
    
    return next(new ErrorHandler("Unable to fetch comments. Please try again later.", 500));
  }
});

// Update a comment
exports.updateComment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { comment_text, rating } = req.body;
  const user_id = req.user.id;

  if (!comment_text) {
    return next(new ErrorHandler("Comment text is required.", 400));
  }

  try {
    // Check if comment exists and belongs to user
    const [comment] = await db.promise().query(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (!comment.length) {
      return next(new ErrorHandler("Comment not found or unauthorized.", 404));
    }

    // Update comment
    const [result] = await db.promise().query(
      "UPDATE comments SET comment_text = ?, rating = ? WHERE id = ?",
      [comment_text, rating || null, id]
    );

    if (result.affectedRows === 0) {
      return next(new ErrorHandler("Unable to update comment.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler("Unable to update comment. Please try again later.", 500));
  }
});

// Delete a comment
exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [result] = await db.promise().query(
      "DELETE FROM comments WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return next(new ErrorHandler("Comment not found or unauthorized.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler("Unable to delete comment. Please try again later.", 500));
  }
});

// Get user comments
exports.getUserComments = catchAsyncErrors(async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const [comments] = await db.promise().query(
      `SELECT 
        c.*, 
        (SELECT COUNT(*) 
         FROM comments replies 
         WHERE replies.parent_comment_id = c.id) as reply_count
      FROM comments c
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    return next(new ErrorHandler("Unable to fetch user comments. Please try again later.", 500));
  }
});