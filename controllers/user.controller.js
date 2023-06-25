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
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const registerApi = async (req, res) => {
    try{
    const { name } = req.body;
    const { email } = req.body;
    const { username } = req.body;
    const { password } = req.body;
    const { password2 } = req.body;
    if (password !== password2) {
      console.log('password do not match with confirm password');
      req.flash('danger', 'Password and Confirm Password do not match with each other');
      res.redirect('/users/register');
    } else {
      User.findOne({ username }, (err, user) => {
        if (err) {
          console.log(`error in post register in users.js${err}`);
        }
        if (user) {
          req.flash('danger', 'Username already exists');
          res.redirect('/users/register');
        } else {
          const user = new User({
            name,
            email,
            username,
            password,
            admin: 0,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) console.log(err);
  
              user.password = hash;
  
              user.save((err) => {
                if (err) {
                  console.log(err);
                } else {
                  req.flash('success', 'You are now registered!');
                  res.redirect('/users/login');
                }
              });
            });
          });
        }
      });
    }
} catch (error) {
    return {
      success: false,
      error,
    };
  }
  };
  
  const logOutApi = async (req, res) => {
    try{
    req.logOut();
    res.clearCookie('username');
    req.flash('success', 'Successfully logged out');
    res.redirect('/users/login');
} catch (error) {
    return {
      success: false,
      error,
    };
  }
  };

  module.exports = { registerApi, logOutApi };