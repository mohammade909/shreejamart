const express = require('express');
const router = express.Router();
const {
    createNotification,
    getNotifications,
    getUserNotifications,
    updateNotificationSeenStatus
} = require('../controllers/notificationController');

// Route to create a new notification
router.post('/', createNotification);

// Route to get all notifications
router.get('/', getNotifications);
router.get('/user/:userId', getUserNotifications);

// Update seen status for a specific notification for a user
router.put('/:userId/:notificationId/read', updateNotificationSeenStatus);

module.exports = router;
