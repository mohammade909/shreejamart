const db = require("../config/database"); // Adjust to your database connection file
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware"); // Adjust to your error handler
const ErrorHandler = require("../utils/errorHandler"); // Custom error handler (optional)

// Get all categories
exports.getCategories = catchAsyncErrors(async (req, res, next) => {
  try {
    const [categories] = await db.promise().query("SELECT * FROM categories");
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(new ErrorHandler("Unable to fetch categories. Please try again later.", 500));
  }
});

// Create a new category
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return next(new ErrorHandler("Category name is required.", 400));
  }

  try {
    await db.promise().query("INSERT INTO categories (name, description) VALUES (?, ?)", [
      name,
      description,
    ]);
    res.status(201).json({
      success: true,
      message: "Category created successfully.",
    });
  } catch (error) {
    next(new ErrorHandler("Unable to create category. Please try again later.", 500));
  }
});

// Update a category
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return next(new ErrorHandler("Name and description are required.", 400));
  }

  try {
    const [result] = await db.promise().query(
      "UPDATE categories SET name = ?, description = ? WHERE category_id = ?",
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return next(new ErrorHandler("Category not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
    });
  } catch (error) {
    next(new ErrorHandler("Unable to update category. Please try again later.", 500));
  }
});

// Delete a category
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query("DELETE FROM categories WHERE category_id = ?", [id]);

    if (result.affectedRows === 0) {
      return next(new ErrorHandler("Category not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    next(new ErrorHandler("Unable to delete category. Please try again later.", 500));
  }
});
