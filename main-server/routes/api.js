/*jshint esversion: 6 */
const router = require('express').Router();
const parser = require('../modules/xmlparser');
const mw = require('./middleware');
const multer = require('multer');
const tsparser = require('../modules/tsparser');

// setup image upload storage
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads'); //change to '/home/jaap/main-server/uploads' in production environment (pm2)
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + '.jpg');
  }
});
const upload = multer({
  storage: storage
});

// methods that require OAUTH (post requests to Goodreads API)
const bindings = {
  '/add_book': {
    url: 'https://www.goodreads.com/shelf/add_to_shelf.xml',
    params: ['name', 'book_id']
  },
  '/remove_book': {
    url: 'https://www.goodreads.com/shelf/add_to_shelf.xml?a=remove',
    params: ['name', 'book_id']
  }
};

///// creates all 'post' routes
for (let route in bindings) {
  router.get(route, mw.authCheck, mw.paramCheck(bindings[route].params), mw.writeRequest(bindings[route].url));
}

//// creates all get routes
// /api/profile -> get data on a users profile
router.get('/profile', mw.authCheck, mw.paramCheck(['key', 'user_id', 'id']), mw.getRequest('https://www.goodreads.com/user/show.xml'), function(req, res, next) {
  res.send(parser.parseProfile(req.data[0]));
});

// /api/search -> search goodreads for a book
router.get('/search', mw.authCheck, mw.paramCheck(['key', 'q', 'search[field]']), mw.getRequest('https://www.goodreads.com/search/index.xml'), function(req, res, next) {
  res.send(parser.parseSearch(req.data[0]));
});

// /api/book -> get data on a book
router.get('/book', mw.authCheck, mw.paramCheck(['key', 'id']), mw.getRequest('https://www.goodreads.com/book/show.xml'), function(req, res, next) {
  res.send(parser.parseBook(req.data[0]));
});

// /api/shelf -> get the books on a users shelf
router.get('/shelf', mw.authCheck, mw.paramCheck(['key', 'id', 'shelf']), mw.getRequest('https://www.goodreads.com/review/list'), function(req, res, next) {
  res.send(parser.parseShelf(req.data[0]));
});

// /api/shelves -> get a list of the users shelves
router.get('/shelves', mw.authCheck, mw.paramCheck(['key', 'user_id']), mw.getRequest('https://www.goodreads.com/shelf/list.xml'), function(req, res, next) {
  res.send(parser.parseShelves(req.data[0]));
});

//// create book-detection route
router.post('/image', mw.authCheck, upload.single('image'), mw.imageRequest, function(req, res, next) {
  tsparser.parseTS(req.data, function(data) {
    res.send(data);
  });
});

module.exports = router;
