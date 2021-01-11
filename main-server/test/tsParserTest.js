/*jshint esversion: 6 */
const expect = require('chai').expect;
const sinon = require('sinon');
const parser = require('../modules/tsparser');
const data = require('./data/data');

describe('Tenserflow Response Parser', function() {
  this.timeout(0);

  describe('parseTS() with valid input', function() {
    it('parseTS JSON response should return an Array of Objects', function(done) {
      let callback = function(result) {
        expect(result).to.be.a('Array');
        expect(result[0]).to.be.a('Object');
        done();
      };
      parser.parseTS(data.ts.input, callback);
    });

    it('parseTS JSON response should be in the correct format', function(done) {
      let callback = function(result) {
        expect(result[0]).to.have.all.keys(data.ts.output);
        done();
      };
      parser.parseTS(data.ts.input, callback);
    });
  });

  describe('parseTS() with invalid input', function() {
    it('parseTS JSON response should return an empty Array ', function(done) {
      let callback = function(result) {
        expect(result).to.be.a('Array');
        expect(result.length).to.equal(0);
        done();
      };
      parser.parseTS('[]', callback);
    });
  });
});
