const express = require('express');

const router = express.Router();

// get cart controller
const cartController = require('../controllers/cart.controller');
/*
* GET add product to cart
*/

router.get('/add/:product', cartController.addProducts);

// get checkout page
router.get('/checkout', cartController.checkout);

// get update  product
router.get('/update/:product', cartController.updateProduct);

// get clear cart
router.get('/clear', cartController.clearCart);

// get buynow
router.get('/buynow', cartController.buyNow);

module.exports = router;
