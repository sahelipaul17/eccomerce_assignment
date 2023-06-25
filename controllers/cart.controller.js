/* eslint-disable brace-style */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-const-assign */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const Product = require('../models/product.model');

const Cart = require('../models/cart.model');

const addProducts = async (req, res) => {
    try {
  const slug = req.params.product;
  await Product.findOne({ slug }, (err, p) => {
    if (err) {
      console.log(`error in /add/:product in cart.js${err}`);
    }
    if (typeof req.session.cart === 'undefined') {
      req.session.cart = [];
      req.session.cart.push({
        title: slug,
        qty: 1,
        tt: p.tt,
        price: parseFloat(p.price).toFixed(2),
        image: `/product_images/${p._id}/${p.image}`,
      });
      const cart = new Cart({
        title: slug,
        qt: 1,
        price: parseFloat(p.price).toFixed(2),
        // eslint-disable-next-line no-underscore-dangle
        image: `/product_images/${p._id}/${p.image}`,
        username: req.cookies.username,

      });
      cart.save(() => {
        if (err) {
          console.log(err);
        } else {
          console.log('added to cart mongodb 1st');
        }
      });
    } else {
      const { cart } = req.session;
      const newItem = true;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].title === slug) {
          // eslint-disable-next-line no-plusplus
          cart[i].qty++;
          // eslint-disable-next-line no-const-assign
          newItem = false;
          break;
        }
      }
      if (newItem) {
        cart.push({
          title: slug,
          qty: 1,
          tt: p.tt,
          price: parseFloat(p.price).toFixed(2),
          image: `/product_images/${p._id}/${p.image}`,

        });

        // eslint-disable-next-line no-shadow
        const cart = new Cart({
          title: slug,
          qt: 1,
          price: parseFloat(p.price).toFixed(2),
          image: `/product_images/${p._id}/${p.image}`,
          username: req.cookies.username,

        });
        cart.save(() => {
          if (err) {
            console.log(err);
          } else {
            console.log('added to cart mongodb');
          }
        });
      }
    }

    req.flash('success', 'Product added');
    res.redirect('back');
  });
} catch (error) {
    return {
      success: false,
      error,
    };
  }
};

const checkout = async (req, res) => {
    try {
    Cart.find({ username: req.cookies.username }, (err, p) => {
      if (err) {
        console.log(err);
      }
      if (p.length === 0) {
        res.render('emptycart', {
          title: 'Empty Cart',
        });
      } else {
        res.render('checkout', {
          title: 'CheckOut',
          cart: p,
        });
      }
    });
  }
catch (error) {
    return {
      success: false,
      error,
    };
  }
};
  const updateProduct = async (req, res) => {
    const slug = req.params.product;
    const { action } = req.query;
    Cart.find({ username: req.cookies.username }, async (err, p) => {
      if (err) {
        console.log(err);
      }
      for (const i = 0; i < p.length; i++) {
        if (p[i].title === slug) {
          console.log(p[i].title);
          console.log(p[i].qt);
          switch (action) {
            case 'add':
              await Cart.findOneAndUpdate({ title: p[i].title }, { qt: p[i].qt + (1) }, { new: true });
              break;
            case 'remove':
              await Cart.findOneAndUpdate({ title: p[i].title }, { qt: p[i].qt - (1) }, { new: true });
              break;
            case 'clear':
              await Cart.findOneAndDelete({ title: p[i].title });
              break;
            default:
              console.log('update problem in /update/:product');
              break;
          }
        }
      }
    });
    req.flash('success', 'Cart updated');
    res.redirect('/cart/checkout');
  };

  const clearCart = async (req, res) => {
    try {
    Cart.deleteMany({ username: req.cookies.username }, async (err) => {
      if (err) {
        console.log('error in clearing cart');
      }
      console.log('cleared cart ');
    });
    // }
  
    delete req.session.cart;
    req.flash('success', 'Cart cleared');
    res.redirect('/cart/checkout');
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

  const buyNow = async (req, res) => {
    try {
            Cart.find({ username: req.cookies.username }, async (err, p) => {
              if (err) {
                console.log(err);
              }
              // console.log(p.qt);
              for (const i = 0; i < p.length; i++) {
                const a = (p[i].qt);
                await Product.findOne({ slug: p[i].title }, (p1) => {
                  if (err) {
                    console.log(err);
                  }
                  const { tt } = p1;
                  console.log(tt);
                  console.log(a);
                  t = tt - a;
                  console.log(t);
                  for (const i = 0; i < p.length; i++) {
                    Product.findOneAndUpdate({ slug: p[i].title }, { tt: t }, { new: true }, (err) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log('updated products in admin side also');
                      }
                    });
                  }
          
                  // Product.findOneAndUpdate({slug:p1.title},{tt:t},{new:true});
                });
                console.log('updated in products');
                // console.log(p[i].title);
                // console.log(p[i].qt);
              }  
              Cart.deleteMany({ username: req.cookies.username }, async (err) => {
                if (err) {
                  console.log('error in clearing cart');
                }
                console.log('cleared cart ');
              });
            
              delete req.session.cart;
              res.sendStatus(200); 
            });
     } catch (error) {
        return {
          success: false,
          error,
        };
      }
};

module.exports = {
addProducts, checkout, updateProduct, clearCart, buyNow,
};