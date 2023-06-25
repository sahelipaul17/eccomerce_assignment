const express = require('express');

const router = express.Router();

const auth = require('../config/auth');

const { isAdmin } = auth;

const adminProductController = require('../controllers/admin_products.controller');

/*
 Get products
*/
router.get('/', isAdmin, adminProductController.getProduct);

// POST ADD Product
router.post('/add-product', isAdmin, adminProductController.addProduct);

// POST EDIT Product
router.patch('/edit-product/:id', isAdmin, adminProductController.editProduct);

/*
 Get delete roduct
*/
router.delete('/delete-product/:id', isAdmin, adminProductController.deleteProduct);

// exports
module.exports = router;
