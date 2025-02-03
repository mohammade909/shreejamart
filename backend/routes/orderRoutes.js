const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create a new order
router.post('/', orderController.createOrder);

// Route to update an existing order by order ID
router.put('/:order_id', orderController.updateOrder);
router.get("/recent-unassigned", orderController.getRecentUnassignedOrders);

// Route to get all orders with pagination and filters
router.get('/', orderController.getAllOrders);

// Route to get orders by vendor ID with pagination and filters
router.get('/vendor/:vendor_id', orderController.getOrdersByVendor);
router.get('/pending/:partner_id', orderController.getPendingOrdersByPartnerId);

// Route to get orders by user ID with pagination and filters
router.get('/user/:userId', orderController.getOrdersByUser);
router.get('/:order_id', orderController.getOrderById);

module.exports = router;
