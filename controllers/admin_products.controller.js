/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable keyword-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-const-assign */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-unused-vars
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

// get models
const Product = require('../models/product.model');

// get Category model
const Category = require('../models/category.model');

const getProduct = async (req, res) => {
    try{
    let count;
    await Product.countDocuments((err, c) => {
      count = c;
    });
    await Product.find((err, products) => {
      res.render('admin/products', {
        products,
        count,
        msg: '',
      });
    });
} catch (error) {
    return {
      success: false,
      error,
    };
  }
  };

const addProduct = async (req, res) => {
    try{
    const imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';
    const { tt } = req.body;
    const { title } = req.body;
    const slug = title.replace(/\s+/g, '-').toLowerCase();// replace spaces with dashes and is in lowercase
    const { desc } = req.body;
    const { price } = req.body;
    const { category } = req.body;
  
    await Product.findOne({ slug }, async (err, product) => {
      if (product) {
        req.flash('danger', 'Page title exists,choose another');
        Category.find((err, categories) => {
          res.render('admin/add_product', {
            title,
            desc,
            categories,
            price,
            tt,
            msg: '',
          });
        });
      } else {
        const price2 = parseFloat(price).toFixed(2);
        const product = new Product({
          title,
          slug,
          desc,
          price: price2,
          tt,
          category,
          image: imageFile,
        });
  
        await product.save((err) => {
          if (err) return console.log(err);
  
          fs.mkdirSync(`image/${product._id}`, (err) => {
            if (err) return console.log(`error in first mkdirp ${err}`);
  
            console.log('dir created in mkdir');
          });
          if (imageFile !== '') {
            const productImage = req.files.image;
  
            const path = `image/${product._id}/${imageFile}`;
            productImage.mv(path, (err) => {
              if (err) {
                return console.log(`ERROR IN PRODUCT IMAGE MV${err}`);
              }
              console.log('no error in productImage mv');
            });
          }
          req.flash('success', 'Product added');
          res.redirect('/admin/products');
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

  const editProduct = async (req, res) => {
    try{
    const imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';
  
    const { title } = req.body;
    const slug = title.replace(/\s+/g, '-').toLowerCase();// replace spaces with dashes and is in lowercase
    const { desc } = req.body;
    const { price } = req.body;
    const { category } = req.body;
    const { pimage } = req.body;
    const { id } = req.params;
    const { tt } = req.body;
  
    await Product.findOne({ slug, _id: { $ne: id } }, async (err, p) => {
      if (err)console.log(`error in post edit product 1st${err}`);
  
      if (p) {
        req.flash('danger', 'Product title exits, choose another');
        res.redirect(`/admin/products/edit-product/${id}`);
      } else {
        await Product.findByIdAndUpdateById(id, (err, p) => {
          if (err)console.log(err);
  
          p.title = title;
          p.slug = slug;
          p.desc = desc;
          p.tt = tt;
          p.price = parseFloat(price).toFixed(2);
          p.category = category;
            if (imageFile !== '') {
              if (pimage !== '') {
                fs.remove(`image/${id}/${pimage}`, (err) => {
                  if (err)console.log(err);
                });
                const productImage = req.files.image;
                const path = `image/${id}/${imageFile}`;
                productImage.mv(path, (err) => {
                  if (err) { return console.log(`error in edit${err}`); }
                  console.log('uploaded');
                });
              }
            }
            req.flash('success', 'Product Edited');
            res.redirect(`/admin/products/edit-product/${id}`);
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
  
  const deleteProduct = async (req, res) => {
    try{
    const { id } = req.params;
    const path = `image/${id}`;
    fs.remove(path, (err) => {
      if (err) {
        console.log(`error in get delete-product/:id${err}`);
      } else {
        Product.findByIdAndDelete(id, (err) => {
          if (err) {
            console.log(`error in product.fingByIdAndRemove${err}`);
          } else {
            console.log('deleted');
          }
        });
        req.flash('success', 'Product deleted');
        res.redirect('/admin/products');
      }
    });
} catch (error) {
    return {
      success: false,
      error,
    };
  }
  };
  module.exports = {
 getProduct, addProduct, editProduct, deleteProduct,
};