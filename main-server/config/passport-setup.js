/*jshint esversion: 6 */
const passport = require('passport');
const GoodreadsStrategy = require('passport-goodreads');
const User = require('../models/user');
const keys = require('./keys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((foundEntry) => {
    done(null, foundEntry);
  });
});

passport.use(new GoodreadsStrategy({
  //Goodreads Options
  consumerKey: keys.goodreads.consumerKey,
  consumerSecret: keys.goodreads.consumerSecret,
  callbackURL: "/auth/redirect" // should be "http://api.myshelf.nl/auth/redirect" in production environment
}, (token, tokenSecret, profile, done) => {
  // Callback Function
  // Update or create user in MyShelf DB
  User.findOneAndUpdate({
    goodreadsId: profile.id
  }, {
    goodreadsId: profile.id,
    name: profile.displayName,
    token: token,
    token_secret: tokenSecret
  }, {
    upsert: true
  }).then((user) => {
    done(null, user);
  });
}));
