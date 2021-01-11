/*jshint esversion: 6 */
const expect = require('chai').expect;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = require('../models/user');

describe('Database', function() {

  before(function(done) {
    mongoose.connect(keys.mongoDB.URI, (err) => {
      done();
    });
  });

  it('connection should be active', function() {
    expect(mongoose.connection.readyState).to.equal(1);
  });

  it('should be able to save a user', function(done) {
    let tempUser = new User({
      goodreadsId: 'TEMPID',
      name: 'TEMPNAME',
      token: 'TEMPTOKEN',
      token_secret: 'TEMPSECRET'
    });
    tempUser.save(done);
  });

  it('should not be able to save a user in wrong format', function(done) {
    let tempUser = new User({
      goodreadsId: 'TEMPID2',
      token: 'TEMPTOKEN',
    });
    tempUser.save(function (err) {
      if (err) {
        return done();
      }
      throw new Error('Should not be able to save user in wrong format');
    });
  });

  it('should not be able to save a duplicate user', function(done) {
    let tempUser = new User({
      goodreadsId: 'TEMPID',
      name: 'TEMPNAME',
      token: 'TEMPTOKEN',
      token_secret: 'TEMPSECRET'
    });
    tempUser.save(function (err) {
      if (err) {
        return done();
      }
      throw new Error('Should not be able to save duplicate user');
    });
  });

  it('should be able to retrieve a user', function(done) {
    User.findOne({goodreadsId: 'TEMPID'}, function(err, user) {
      if (err) {
        throw err;
      }
      if (user.name === 'TEMPNAME') {
        return done();
      }
      throw new Error('Failed to retrieve user');
    });
  });

  it('should be able to remove a user', function(done) {
    User.findOne({goodreadsId: 'TEMPID'}).remove(done);
  });

  after(function(done) {
    User.find({goodreadsId: 'TEMPID'}).remove(function(){
     mongoose.connection.close(done);
    });
  });
});
