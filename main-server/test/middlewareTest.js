/*jshint esversion: 6 */
const expect = require('chai').expect;
const mw = require('../routes/middleware');
const sinon = require('sinon');
const keys = require('../config/keys');

describe('Middleware', function() {

  describe('authCheck', function() {
    it('should be a function that accepts 3 params', function() {
      expect(mw.authCheck).to.be.a('function');
      expect(mw.authCheck.length).to.equal(3);
    });

    it('should call next() if authenticated', function() {
      let headerSpy = sinon.spy();
      let nextSpy = sinon.spy();
      mw.authCheck({user: 'PLACEHOLDER'}, {setHeader: headerSpy}, nextSpy);
      expect(headerSpy.called).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });

    it('should stop if not authenticated', function() {
      let sendSpy = sinon.spy();
      let nextSpy = sinon.spy();
      mw.authCheck({}, {send: sendSpy}, nextSpy);
      expect(sendSpy.calledOnce).to.be.true;
      expect(sendSpy.calledWith({"authenticated":false})).to.be.true;
      expect(nextSpy.called).to.be.false;
    });
  });



  describe('paramCheck', function() {
    it('should return a function that accepts 3 params', function() {
      let pc = mw.paramCheck([]);
      expect(pc).to.be.a('function');
      expect(pc.length).to.equal(3);
    });

    it('should call next() if not missing parameters', function() {
      let pc = mw.paramCheck([]);
      let nextSpy = sinon.spy();
      pc({}, {}, nextSpy);
      expect(nextSpy.calledOnce).to.be.true;
    });

    it('should stop if missing parameters', function() {
      let pc = mw.paramCheck(['testparam']);
      let nextSpy = sinon.spy();
      let sendSpy = sinon.spy();
      pc({query: {}}, {send: sendSpy, status: sinon.spy()}, nextSpy);
      expect(sendSpy.calledOnce).to.be.true;
      expect(sendSpy.calledWith({
        statusCode: 404,
        message: 'Bad Request'
      })).to.be.true;
      expect(nextSpy.called).to.be.false;
    });

    it('should automatically add known parameters', function() {
      let pc = mw.paramCheck(['key']);
      let nextSpy = sinon.spy();
      let req = {query: {}};
      pc(req, {}, nextSpy);
      expect(nextSpy.calledOnce).to.be.true;
      expect(req.locals).to.have.property('key');
    });
  });



  describe('getRequest', function() {
    it('should return a function that accepts 3 params', function() {
      let gr = mw.getRequest('');
      expect(gr).to.be.a('function');
      expect(gr.length).to.equal(3);
    });

    it('should call next() if success', function(done) {
      let gr = mw.getRequest('http://www.google.nl');
      let req = {query: {}, locals: {}};
      gr(req, {}, done);
    });

    it('should add response to req data if success', function(done) {
      let gr = mw.getRequest('http://www.google.nl');
      let req = {query: {}, locals: {}};
      gr(req, {}, function() {
        expect(req.data).to.be.a('array');
        expect(req.data.length).to.equal(1);
        done();
      });
    });

    it('should return error if request failed', function(done) {
      let gr = mw.getRequest('notarealurl');
      let sendSpy = sinon.spy(function() {
        expect(sendSpy.calledOnce).to.be.true;
        expect(sendSpy.calledWith({
          statusCode: 404,
          message: 'Bad Request'
        })).to.be.true;
        done();
      });
      let req = {query: {}, locals: {}};
      gr(req, {status: sinon.spy(), send: sendSpy}, {});
  });
});



  describe('writeRequest', function() {
    it('should return a function that accepts 3 params', function() {
      let gr = mw.writeRequest('');
      expect(gr).to.be.a('function');
      expect(gr.length).to.equal(3);
    });

    it('should return OK if success', function(done) {
      let gr = mw.writeRequest('http://httpbin.org/post');
      let req = {query: {}, user: {token: 'TEMPTOKEN', token_secret: 'TEMPTOKEN'}};
      let sendSpy = sinon.spy(function() {
        expect(sendSpy.calledOnce).to.be.true;
        expect(sendSpy.calledWith({
          statusCode: 200,
          message: 'OK'
        })).to.be.true;
        done();
      });
      gr(req, {status: sinon.spy(), send: sendSpy}, {});
    });

    it('should return error message if fault', function(done) {
      let gr = mw.writeRequest('');
      let req = {query: {}, user: {token: 'TEMPTOKEN', token_secret: 'TEMPTOKEN'}};
      let sendSpy = sinon.spy(function() {
        expect(sendSpy.calledOnce).to.be.true;
        expect(sendSpy.calledWith({
          statusCode: 404,
          message: 'Bad Request'
        })).to.be.true;
        done();
      });
      gr(req, {status: sinon.spy(), send: sendSpy}, {});
    });
  });
});
