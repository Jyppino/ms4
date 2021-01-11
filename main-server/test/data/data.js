/*jshint esversion: 6 */
const fs = require('fs');
const path = require('path');

const readFile = function(file) {
  return fs.readFileSync(file, {
    encoding: 'utf8'
  });
};

module.exports = {
  profile: {
    xml: readFile(path.join(__dirname, '/xml/profile.xml')),
    json: JSON.parse(readFile(path.join(__dirname, '/../../public/examples/profile.json')))
  },
  shelf: {
    xml: readFile(path.join(__dirname, '/xml/shelf.xml')),
    json: JSON.parse(readFile(path.join(__dirname, '/../../public/examples/shelf.json')))
  },
  shelves: {
    xml: readFile(path.join(__dirname, '/xml/shelves.xml')),
    json: JSON.parse(readFile(path.join(__dirname, '/../../public/examples/shelves.json')))
  },
  book: {
    xml: readFile(path.join(__dirname, '/xml/book.xml')),
    json: JSON.parse(readFile(path.join(__dirname, '/../../public/examples/book.json')))
  },
  search: {
    xml: readFile(path.join(__dirname, '/xml/search.xml')),
    json: JSON.parse(readFile(path.join(__dirname, '/../../public/examples/search.json')))
  },
  ts: {
    input: readFile(path.join(__dirname, '/tsoutput.json')),
    output: ['height', 'width', 'x', 'y', 'id', 'title', 'authors', 'image_url']
  }
};
