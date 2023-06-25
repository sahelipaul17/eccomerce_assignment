const express = require('express');

const router = express.Router();

const auth = require('../config/auth');

const { isAdmin } = auth;

// get Category model

const CategoryController = require('../controllers/admin_category.controller');

/*
 Get category indexes
*/
router.get('/', isAdmin, CategoryController.getCategory);

// POST ADD Category
router.post('/add-category', isAdmin, CategoryController.addCategory);

// POST EDIT Category
router.patch('/edit-category/:id', isAdmin, CategoryController.editCategory);
/*
 Get delete category
*/
router.delete('/delete-category/:id', isAdmin, CategoryController.deleteCategory);

// exports
module.exports = router;
