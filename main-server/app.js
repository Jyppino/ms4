/*jshint esversion: 6 */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const keys = require('./config/keys');
const mw = require('./routes/middleware');

// import routes
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// database connection
mongoose.connect(keys.mongoDB.URI, () => {
  console.log("Successfully connected to MongoDB MyShelf Database");
});

//Setup session
app.use(session({
  secret: keys.session.key,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: false
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));


// routes setup
app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.get('/', function(req, res, next) {
  res.render('index'); // documentation page
});

app.get('/demo', mw.authCheck, function(req, res, next) {
  res.render('demo'); // demo page
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/');
  //next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
