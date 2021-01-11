/*jshint esversion: 6 */
const fastXmlParser = require('fast-xml-parser');

const options = {
  ignoreAttributes: false
};

// HELPER FUNCTIONS
// parse authors from a json object
const parseAuthors = function(jsonObj) {
  let result = [];
  if (jsonObj instanceof Array) {
    for (let author of jsonObj) {
      result.push({
        id: author.id,
        name: author.name,
        role: ((author.role === "") ? "Author" : author.role)
      });
    }
  } else {
    result.push({
      id: jsonObj.id,
      name: jsonObj.name,
      role: "Author"
    });
  }
  return result;
};

// parse similar books from a json object
const parseSimilarBooks = function(jsonObj) {
  let result = [];
  if (jsonObj instanceof Array) {
    for (let books of jsonObj) {
      result.push({
        id: books.id,
        title: books.title,
        authors: parseAuthors(books.authors.author),
        link: books.link,
        isbn: books.isbn,
        image_url: books.image_url,
        average_rating: books.average_rating,
      });
    }
  }
  return result;
};

// parse buy links from json object
const parseBuyLinks = function(jsonObj) {
  let result = [];
  if (jsonObj instanceof Array) {
    for (let buy of jsonObj) {
      result.push({
        name: buy.name,
        link: buy.link
      });
    }
  }
  return result;
};


// PARSE FUNCTIONS
// parses a users profile
exports.parseProfile = function(xml) {
  const jsonObj = fastXmlParser.parse(xml).GoodreadsResponse.user;
  let userProfile = {
    id: jsonObj.id,
    name: jsonObj.name,
    link: jsonObj.link,
    image: jsonObj.image_url,
    shelves: []
  };
  for (let shelf of jsonObj.user_shelves.user_shelf) {
    userProfile.shelves.push({
      id: shelf.id,
      name: shelf.name,
      count: shelf.book_count
    });
  }
  return userProfile;
};

// parses a users shelf
exports.parseShelf = function(xml) {
  const jsonObj = fastXmlParser.parse(xml, options);
  let books = [];
  if (jsonObj.GoodreadsResponse.books.book instanceof Array) {
    for (let book of jsonObj.GoodreadsResponse.books.book) {
      books.push({
        id: book.id['#text'],
        title: book.title,
        authors: parseAuthors(book.authors.author),
        link: book.link,
        image_url: book.image_url
      });
    }
  } else {
    if (jsonObj.GoodreadsResponse.books.book) {
      let book = jsonObj.GoodreadsResponse.books.book;
      books.push({
        id: book.id['#text'],
        title: book.title,
        authors: parseAuthors(book.authors.author),
        link: book.link,
        image_url: book.image_url
      });
    }
  }

  return {
    numpages: jsonObj.GoodreadsResponse.books['@_numpages'],
    books
  };
};

// parses a list of the users shelves
exports.parseShelves = function(xml) {
  const jsonObj = fastXmlParser.parse(xml);
  let shelves = [];
  for (let shelf of jsonObj.GoodreadsResponse.shelves.user_shelf) {
    shelves.push({
      id: shelf.id,
      name: shelf.name,
      count: shelf.book_count
    });
  }
  return {
    shelves
  };
};

// parse book
exports.parseBook = function(xml) {
  const jsonObj = fastXmlParser.parse(xml).GoodreadsResponse.book;
  return {
    id: jsonObj.id,
    title: jsonObj.title,
    authors: parseAuthors(jsonObj.authors.author),
    link: jsonObj.link,
    isbn: jsonObj.isbn,
    image_url: jsonObj.image_url,
    publication_year: jsonObj.work.original_publication_year,
    description: jsonObj.description,
    average_rating: jsonObj.average_rating,
    buy_links: parseBuyLinks((jsonObj.buy_links.buy_link == undefined) ? [] : jsonObj.buy_links.buy_link),
    similar_books: parseSimilarBooks((jsonObj.similar_books == undefined) ? [] : jsonObj.similar_books.book)
  };
};

// parse search query results
exports.parseSearch = function(xml) {
  const jsonObj = fastXmlParser.parse(xml).GoodreadsResponse.search;
  results = [];

  let total_results = jsonObj['total-results'];
  if (total_results > 1) {
    for (let result of jsonObj.results.work) {
      results.push({
        id: result.best_book.id,
        title: result.best_book.title,
        authors: parseAuthors(result.best_book.author),
        image_url: result.best_book.image_url
      });
    }
  }
  if (total_results == 1) {
    let result = jsonObj.results.work;
    results.push({
      id: result.best_book.id,
      title: result.best_book.title,
      authors: parseAuthors(result.best_book.author),
      image_url: result.best_book.image_url
    });
  }
  return {
    results
  };
};
