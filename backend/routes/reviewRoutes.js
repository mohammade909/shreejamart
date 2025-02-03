const express = require('express');
const router = express.Router();
const {createReview, getReviewsByEntity, getAverageRating, getReviewById, updateReview, deleteReview, getReviewsGroupedByEntityType} = require('../controllers/reviewController')

// Middleware for authentication and authorization can be added here




router.post('/create', createReview)
router.get('/', getReviewsGroupedByEntityType)
// Get reviews for a specific entity
router.get('/:entity_type/:entity_id',getReviewsByEntity)
// Get average rating for an entity

router.get(
  '/average-rating/:entity_type/:entity_id', 
  getAverageRating
);

// Get a single review by ID
router.get(
  '/:id', 
  getReviewById
);

// Update a review
router.put(
  '/update/:id', 
  updateReview
);

// Delete a review
router.delete(
  '/delete/:id', 
  deleteReview
);

module.exports = router;