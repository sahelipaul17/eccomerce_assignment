const express = require('express');

const router = express.Router();

// get models
const productController = require('../controllers/product.controller');

/*
* GET all products
*/
router.get('/', productController.productList);

/*
* GET all products  by category
*/

router.get('/:category', productController.categoryList);

/*
* GET all products details
*/
router.get('/:category/:product', productController.productCategory);

module.exports = router;
