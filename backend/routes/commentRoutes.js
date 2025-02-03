const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getUserComments
} = require('../controllers/commentsController');
const { isAuthenticatedUser } = require('../middlewares/authMiddleware');

router.post('/comment', isAuthenticatedUser, createComment);
router.get('/comments/:content_type/:content_id', getComments);
router.get('/user/comments', isAuthenticatedUser, getUserComments);
router.put('/comment/:id', isAuthenticatedUser, updateComment);
router.delete('/comment/:id', isAuthenticatedUser, deleteComment);

module.exports = router;