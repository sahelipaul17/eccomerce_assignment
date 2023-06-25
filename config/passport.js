/* eslint-disable consistent-return */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

module.exports = async function (pass) {
  await pass.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        console.log(`error in module.exports in passport.js${err}`);
      }
      if (!user) {
        return done(null, false, { message: 'No user found' });
      }
      bcrypt.compare(password, user.password, (isMatch) => {
        if (err) {
          console.log(`error in bcrypt.compare in passport.js${err}`);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: 'Wrong password' });
      });
    });
  }));
};
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
