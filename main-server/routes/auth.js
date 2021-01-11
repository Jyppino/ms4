/*jshint esversion: 6 */
const router = require('express').Router();
const passport = require('passport');
const path = require('path');
const mw = require('./middleware');

// create OAUTH request using passport.js
router.get('/login', passport.authenticate('goodreads'));

// destroys session server side
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    res.redirect('/auth/status');
  });
});

// callback from Goodreads OAUTH
router.get('/redirect', passport.authenticate('goodreads'), function(req, res, next) {
  res.render('close');
});

// get authentication status
router.get('/status', mw.authCheck, function(req, res, next) {
  res.send({
    authenticated: true
  });
});

module.exports = router;
