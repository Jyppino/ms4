/*jshint esversion: 6 */
const keys = require('../config/keys');
const request = require('request');
const fs = require('fs');

const oauth = {
  consumer_key: keys.goodreads.consumerKey,
  consumer_secret: keys.goodreads.consumerSecret
};

// verify if the user is authenticated (passport.js will add an user object to request)
exports.authCheck = function(req, res, next) {
  if (!req.user) {
    // user not authenticated
    res.send({
      "authenticated": false
    });
  } else {
    // user is authenticated
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  }
};

// verify that there are no missing parameters
exports.paramCheck = function(params) {
  return function(req, res, next) {
    let insertedParams = {};
    let missingParams = false;

    params.forEach(function(param) {
      if (!(param in req.query)) {
        switch (param) { // adds key, user_id (id) parameters
          case 'key':
            insertedParams[param] = keys.goodreads.consumerKey;
            break;
          case 'user_id':
            insertedParams[param] = req.user.goodreadsId;
            break;
          case 'id':
            insertedParams[param] = req.user.goodreadsId;
            break;
          case 'search[field]':
            insertedParams[param] = 'all';
            break;
          default:
            missingParams = true;
            break;
        }
      }
    });
    if (missingParams) { // return Bad Request if missing params
      res.status(404);
      res.send({
        statusCode: 404,
        message: 'Bad Request'
      });
    } else {
      req.locals = insertedParams;
      next();
    }
  };
};

// perform get request to url and attach response to request object
exports.getRequest = function(url) {
  return function(req, res, next) {
    request({
      url: url,
      qs: Object.assign(req.query, req.locals)
    }, function(err, response, body) {
      if (err || response.statusCode !== 200) {
        res.status((err) ? 404 : response.statusCode);
        res.send({
          statusCode: (err) ? 404 : response.statusCode,
          message: (err) ? 'Bad Request' : response.statusMessage
        });
      } else {
        if (req.data) {
          req.data.push(body);
        } else {
          req.data = [body];
        }
        next();
      }
    });
  };
};

// perform post request to url with authentication token attached
exports.writeRequest = function(url) {
  return function(req, res, next) {
    // create authentication token
    let oauthToken = Object.assign(oauth, {
      token: req.user.token,
      token_secret: req.user.token_secret
    });
    // post request to URL with authentication token and req.query params
    request.post({
      url: url,
      oauth: oauthToken,
      form: req.query
    }, function(err, response, body) {
      res.status((err) ? 404 : response.statusCode);
      res.send({
        statusCode: (err) ? 404 : response.statusCode,
        message: (err) ? 'Bad Request' : response.statusMessage
      });
    });
  };
};

// perform post image request to Tensorflow server and attach response to request object
exports.imageRequest = function(req, res, next) {
  let formData = {
    image: fs.createReadStream(req.file.path)
  };

  request.post({
    url: 'http://localhost:5000/image',
    formData: formData
  }, function(err, response, body) {

    fs.unlink(req.file.path);

    if (err || response.statusCode !== 200) {
      res.status((err) ? 404 : response.statusCode);
      res.send({
        statusCode: (err) ? 404 : response.statusCode,
        message: (err) ? 'Bad Request' : response.statusMessage
      });
    } else {
      req.data = body;
      next();
    }
  });

};
