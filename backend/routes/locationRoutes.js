const express = require('express');
const router = express.Router();
const {
    createLocation,
    getUserLocations,
    updateLocation,
    deleteLocation,
} = require('../controllers/locationController');

// Create a new location
router.post('/', createLocation);

// Get all locations for a user
router.get('/:user_id', getUserLocations);

// Update a location
router.put('/:location_id', updateLocation);

// Delete a location
router.delete('/:location_id', deleteLocation);

module.exports = router;
