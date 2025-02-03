const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware');

// Route to create a new blog post
router.post('/', blogsController.createBlog);

// Route to get all blog posts
router.get('/', blogsController.getAllBlogs);

// Route to get a single blog post by ID
router.get('/:id', blogsController.getBlogById);
router.get('/user/:user_id', blogsController.getBlogByUser);

// Route to update a blog post by ID
router.put('/:id', blogsController.updateBlog);

// Route to delete a blog post by ID
router.delete('/:id',  blogsController.deleteBlog);

module.exports = router;
