/*jshint esversion: 6 */
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const keys = require('../config/keys');
const middleware = require('../routes/middleware');
const request = require('request');

chai.use(chaiHttp);

let requester;
let app;

describe('Routes', function() {
  this.timeout(0);

  before(function(done) {
    // mock authentication
    sinon.stub(middleware, 'authCheck').callsFake(function (req, res, next) {
      req.user = keys.testuser;
      next();
    });

    app = require('../app');
    requester = chai.request(app).keepOpen();
    setTimeout(done, 3000);
  });



  describe('Auth Routes', function() {

    describe('Authenticated', function() {
      describe('/status', function() {
        it('Should return true if authenticated', function(done) {
          requester.get('/auth/status').end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.a('Object');
            expect(res.body).to.have.property('authenticated');
            expect(res.body.authenticated).to.equal(true);
            done();
          });
        });
      });
    });

    describe('Not authenticated', function() {
      describe('/logout', function() {
        it('Logout should set authenticated to false', function(done) {
          requester.get('http://api.myshelf.nl/auth/logout').end(function(err, res) {
            request({
              url: 'http://api.myshelf.nl/auth/status',
            }, function(err, response, body) {
              body = JSON.parse(body);
              expect(response.statusCode).to.equal(200);
              expect(body).to.be.a('Object');
              expect(body).to.have.property('authenticated');
              expect(body.authenticated).to.equal(false);
              done();
            });
          });
        });
      });

      describe('/status', function() {
        it('Should return false if not authenticated', function(done) {
          request({
            url: 'http://api.myshelf.nl/auth/status',
          }, function(err, response, body) {
            body = JSON.parse(body);
            expect(response.statusCode).to.equal(200);
            expect(body).to.be.a('Object');
            expect(body).to.have.property('authenticated');
            expect(body.authenticated).to.equal(false);
            done();
          });
        });
      });
    });
  });



  describe('API Routes', function() {
    describe('/profile', function() {
      it('retrieve profile data', function(done) {
        requester.get('/api/profile').end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('shelves');
          done();
        });
      });
    });

    describe('/shelves', function() {
      it('retrieve list of user\'s shelves', function(done) {
        requester.get('/api/shelves').end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.have.property('shelves');
          done();
        });
      });
    });

    describe('/shelf', function() {
      it('retrieve books on a user\'s shelf', function(done) {
        requester.get('/api/shelf?shelf=read').end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.have.property('books');
          done();
        });
      });
      it('return error if missing shelf name', function(done) {
        requester.get('/api/shelf').end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('Bad Request');
          done();
        });
      });
    });

    describe('/book', function() {
      it('retrieve information on a book', function(done) {
        requester.get('/api/book?id=3836').end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.have.property('title');
          expect(res.body).to.have.property('authors');
          done();
        });
      });
      it('return not found if missing/incorrect book id ', function(done) {
        requester.get('/api/book').end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('Not Found');
          done();
        });
      });
    });

    describe('/search', function() {
      it('find book given a query', function(done) {
        requester.get('/api/search?q=Don+Quixote').end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('Object');
          expect(res.body).to.have.property('results');
          done();
        });
      });
      it('return error if missing query', function(done) {
        requester.get('/api/search').end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('Bad Request');
          done();
        });
      });
    });

    describe('/add_book', function() {
      it('add a real book to a user\'s shelf', function(done) {
        requester.get('/api/add_book?name=read&book_id=9736930').end(function(err, res) {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('Created');
          done();
        });
      });
      it('shouldn\'t add a fake book to a user\'s shelf', function(done) {
        requester.get('/api/add_book?name=read&book_id=XXX').end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('Not Found');
          done();
        });
      });
      it('return error if missing parameters', function(done) {
        requester.get('/api/add_book').end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('Bad Request');
          done();
        });
      });
    });

    describe('/remove_book', function() {
      it('remove a book from a user\'s shelf (if present)', function(done) {
        requester.get('/api/remove_book?name=read&book_id=9736930').end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('OK');
          done();
        });
      });
      it('shouldn\'t remove a fake book from a user\'s shelf', function(done) {
        requester.get('/api/remove_book?name=read&book_id=XXX').end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.a('Object');
          expect(res.body.message).to.equal('Not Found');
          done();
        });
        it('return error if missing parameters', function(done) {
          requester.get('/api/remove_book').end(function(err, res) {
            expect(res.statusCode).to.equal(404);
            expect(res.body).to.be.a('Object');
            expect(res.body.message).to.equal('Bad Request');
            done();
          });
        });
      });
    });
  });



  after(function() {
    requester.close();
    middleware.authCheck.restore();
  });
});
