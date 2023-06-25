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
const Category = require('../models/category.model');

const getCategory = async (req, res) => {
    await Category.find((err, categories) => {
      if (err) {
        return console.log(err);
      }
      res.render('admin/categories', {
        categories, msg: '',
  
      });
    });
  };

const addCategory = async (req, res) => {
    const { title } = req.body;
    if (title === '' || title === null) {
      req.flash('danger', 'Title empty ');
      res.render('./admin/add_category', {
        title,
        msg: '',
      });
    }else {
      const slug = title.replace(/\s+/g, '-').toLowerCase();// replace spaces with dashes and is in lowercase
      console.log(slug);
  
      Category.findOne({ slug }, (err, category) => {
        if (category) {
          req.flash('danger', 'Category title exists,choose another');
  
          res.render('/admin/add_category', {
            title,
  
          });
        } else {
          // console.log(req.body);
          const categories = new Category({
            title,
            slug,
          });
  
          categories.save((err) => {
            if (err) {
              console.log(`error in categories.save in admin_categories.js${err}`);
            } else {
              Category.find(async (err, categories) => {
                if (err) {
                  console.log(err);
                } else {
                  req.app.locals.categories = categories;
                }
              });
            }
          });
  
          req.flash('success', 'Category added');
          res.redirect('/admin/categories');
        }
      });
    }
  };

const editCategory = async (req, res) => {
    const { title } = req.body;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const { id } = req.params;
  
    Category.findOne({ slug, _id: { $ne: id } }, async (err, page) => {
      if (page) {
        req.flash('info', 'slug already exists');
        res.redirect('/admin/pages');
      } else {
        Category.findOne({ slug, _id: { $ne: id } }, (err, category) => {
          if (category) {
            req.flash('danger', 'Category already exists, choose another');
            res.render('admin/edit_category', {
              title,
              id,
              msg: '',
            });
          } else {
            Category.updfindOneAndUpdateate(id, (err, category) => {
              if (err) {
                console.log(err);
              } else {
                category.title = title;
                category.slug = slug;
  
                category.save((err) => {
                  if (err) return console.log(err);
  
                  Category.find(async (err, categories) => {
                    if (err) {
                      console.log(err);
                    } else {
                      req.app.locals.categories = categories;
                    }
                  });
  
                  req.flash('success', 'Category Edited');
                  res.redirect(`/admin/categories/edit-category/${id}`);
                });
              }
            });
          }
        });
      }
    });
  };
  
const deleteCategory = async (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        console.log(err);
      } else {
        Category.find(async (err, categories) => {
          if (err) {
            console.log(err);
          } else {
            req.app.locals.categories = categories;
          }
        });
  
        req.flash('success', 'Category Deleted successfully ');
        res.redirect('/admin/categories');
      }
    });
  };
module.exports = {
 addCategory, getCategory, editCategory, deleteCategory, 
};  
