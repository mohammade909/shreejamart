const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// const cartItemController = require('../controllers/cartItemController');
// Cart routes
router.post('/', cartController.addItemToCart);
router.get('/user/:user_id', cartController.getUserCart);
router.put('/update/:id', cartController.updateCartItem);
router.delete('/remove/:id', cartController.deleteCartItem);
// router.get('/carts/:id', cartController.getCartById);
// router.delete('/carts/:id', cartController.deleteCart);

// Cart item routes
// router.post('/cart-items', cartItemController.addItemToCart);
// router.get('/cart-items/:cart_id', cartItemController.getCartItems);
// router.put('/cart-items/:id', cartItemController.updateCartItem);
// router.delete('/cart-items/:id', cartItemController.deleteCartItem);

module.exports = router;
