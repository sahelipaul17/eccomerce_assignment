const express = require('express');

const router = express.Router();

const passport = require('passport');

const userController = require('../controllers/user.controller');

/*
* GET register
*/

router.get('/register', async (req, res) => {
  res.render('register', {
    title: 'Register',
  });
});

router.post('/register', userController.registerApi);

// get login
router.get('/login', async (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  }
  res.render('login', {
    title: 'Log In',
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: true,
// eslint-disable-next-line no-unused-vars
}), (req, res, next) => {
  res.cookie('username', req.body.username, { maxAge: 900000, httpOnly: true });
  res.redirect('/products');
});

// get logout
router.get('/logout', userController.logOutApi);

module.exports = router;
