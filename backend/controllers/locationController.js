const catchAsyncErrors = require('../middlewares/cathAsyncErrorsMiddleware'); // Custom error handling middleware
const db = require('../config/database'); // Your MySQL database connection

// Create a new location
exports.createLocation = catchAsyncErrors(async (req, res, next) => {
    const { user_id, latitude, longitude, address, phoneNumber } = req.body;
   
    if (!latitude || !longitude || !phoneNumber) {
        return res.status(400).json({ message: "User ID, latitude, longitude, and phone number are required." });
    }

    const query = `
        INSERT INTO user_locations (user_id, phone, latitude, longitude, full_address)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [user_id, phoneNumber, latitude, longitude, address || null];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error." });
        }

        res.status(201).json({
            message: "Location added successfully.",
            locationId: result.insertId,
        });
    });
});


// Get all locations for a user
exports.getUserLocations = catchAsyncErrors(async (req, res, next) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `SELECT * FROM user_locations WHERE user_id = ?`;

    db.query(query, [user_id], (err, results) => {
        if (err) return next(err);

        res.status(200).json({
            locations: results,
        });
    });
});

// Update a location
exports.updateLocation = catchAsyncErrors(async (req, res, next) => {
    const { location_id } = req.params;
    const { latitude, longitude, address } = req.body;

    if (!location_id) {
        return res.status(400).json({ message: "Location ID is required." });
    }

    const query = `
        UPDATE user_locations
        SET latitude = ?, longitude = ?, address = ?
        WHERE location_id = ?
    `;

    const values = [latitude || null, longitude || null, address || null, location_id];

    db.query(query, values, (err, result) => {
        if (err) return next(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Location not found." });
        }

        res.status(200).json({
            message: "Location updated successfully.",
        });
    });
});

// Delete a location
exports.deleteLocation = catchAsyncErrors(async (req, res, next) => {
    const { location_id } = req.params;

    if (!location_id) {
        return res.status(400).json({ message: "Location ID is required." });
    }

    const query = `DELETE FROM user_locations WHERE location_id = ?`;

    db.query(query, [location_id], (err, result) => {
        if (err) return next(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Location not found." });
        }

        res.status(200).json({
            message: "Location deleted successfully.",
        });
    });
});
