/*jshint esversion: 6 */
const expect = require('chai').expect;
const parser = require('../modules/xmlparser');
const data = require('./data/data');

describe('XML Parser', function() {

  describe('parseProfile()', function() {
    it('parseProfile should return a JSON/JS Object', function() {
      let result = parser.parseProfile(data.profile.xml);
      expect(result).to.be.a('Object');
    });
    it('parseProfile JSON response should be in correct format', function() {
      let result = parser.parseProfile(data.profile.xml);
      expect(result).to.deep.equal(data.profile.json);
    });
  });

  describe('parseShelf()', function() {
    it('parseShelf should return a JSON/JS Object', function() {
      let result = parser.parseShelf(data.shelf.xml);
      expect(result).to.be.a('Object');
    });
    it('parseShelf JSON response should be in correct format', function() {
      let result = parser.parseShelf(data.shelf.xml);
      expect(result).to.deep.equal(data.shelf.json);
    });
  });

  describe('parseShelves()', function() {
    it('parseShelves should return a JSON/JS Object', function() {
      let result = parser.parseShelves(data.shelves.xml);
      expect(result).to.be.a('Object');
    });
    it('parseShelves JSON response should be in correct format', function() {
      let result = parser.parseShelves(data.shelves.xml);
      expect(result).to.deep.equal(data.shelves.json);
    });
  });

  describe('parseBook()', function() {
    it('parseBook should return a JSON/JS Object', function() {
      let result = parser.parseBook(data.book.xml);
      expect(result).to.be.a('Object');
    });
    it('parseBook JSON response should be in correct format', function() {
      let result = parser.parseBook(data.book.xml);
      expect(result).to.have.all.keys(data.book.json);
    });
  });

  describe('parseSearch()', function() {
    it('parseSearch should return a JSON/JS Object', function() {
      let result = parser.parseSearch(data.search.xml);
      expect(result).to.be.a('Object');
    });
    it('parseSearch JSON response should be in correct format', function() {
      let result = parser.parseSearch(data.search.xml);
      expect(result).to.deep.equal(data.search.json);
    });
  });
});
