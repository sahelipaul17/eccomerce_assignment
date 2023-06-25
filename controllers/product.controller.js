/* eslint-disable array-callback-return */
/* eslint-disable func-names */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-const-assign */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');

const Product = require('../models/product.model');

const Category = require('../models/category.model');

const auth = require('../config/auth');

// eslint-disable-next-line no-unused-vars
const { isUser } = auth;

const productList = async function (req, res) {
  try {
    console.log(req.cookies.username);
    return await Product.find((err, products) => {
      if (err) {
        console.log(`error in router.get('/) in products.js ${err}`);
      }
      res.render('all_products', {
        title: 'All products',
        products,
      });
    });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// eslint-disable-next-line consistent-return
const categoryList = async function (req, res) {
  try {
    const categorySlug = req.params.category;
    // eslint-disable-next-line no-undef
    await Category.findOne({ slug: categorySlug }, (err, c) => {
      Product.find({ category: categorySlug }, (products) => {
        if (err) {
          console.log(`error in router.get('/:category) in products.js ${err}`);
        }
        res.render('cat_products', {
          title: c.title,
          products,
        });
      });
    });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// eslint-disable-next-line func-names, consistent-return
const productCategory = async function (req, res) {
  try {
    const galleryImages = null;
    const loggedIn = !!(req.isAuthenticated());
    await Product.findOne({ slug: req.params.product }, (err, product) => {
      if (err) {
        console.log(`err in /:category/:product in products.js${err}`);
      } else {
        // eslint-disable-next-line no-underscore-dangle
        const galleryDir = `public/product_images/${product._id}/gallery`;
        fs.readdir(galleryDir, (files) => {
          if (err) {
            console.log(`error in /:category/:product in fs readir${err}`);
          } else {
            galleryImages = files;
            res.render('product', {
              title: product.title,
              p: product,
              galleryImages,
              loggedIn,
            });
          }
        });
      }
    });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

module.exports = { productList, categoryList, productCategory };
