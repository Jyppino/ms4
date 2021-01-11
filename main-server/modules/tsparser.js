/*jshint esversion: 6 */
const request = require('request');
const xmlparser = require('./xmlparser');
const keys = require('../config/keys');

const parseResults = function(results) {
  let parsedResults = [];

  for (let i in results) {
    let response = results[i].resp;

    if (response.statusCode == 200) {
      response = xmlparser.parseSearch(response.body);
      if (response.results.length !== 0) {

        let topSearchResult = response.results[0];
        let curResp = results[i].obj;

        delete curResp.name;
        delete curResp.class_name;
        delete curResp.score;
        delete curResp.word_data_array;

        parsedResults.push(Object.assign(curResp, topSearchResult));
      }
    }
  }
  return parsedResults;
};

exports.parseTS = function(jsonObj, callback) {
  console.log("json: " + '\n' + jsonObj + ' \n' + '\n');
  jsonObj = JSON.parse(jsonObj);

  if (jsonObj.length === 0) {
    callback([]);
  }

  jsonObj.shift();
  
  let responses = [];
  let counter = 0;

  for (let i in jsonObj) {
    let book = jsonObj[i];

    // Initialize the search string that will be used to query Goodreads
    let searchString = "";

    // Initialize the maximum height (i.e. the height of the largest word found)
    let max_height = 0;

    // The height margin of words that we will include in the search query
    // Example: if margin = 0.5, we will add all words that are half the height of the max height
    // and greater to the search string
    let height_margin = 0.5;
    let word_height_minimum = 1 - height_margin;

    // Here we actually check for each word if its height is large enough
    for (let x in book.word_data_array) {
        let word_data = book.word_data_array[x];
        // If we are at the first entry of the array, which stores the full OCR result
        // we save the max height found under height here
        if (x == 0) {
            max_height = book.word_data_array[x].height;
            continue;
        }
        // If the word is high enough, and has more than 3 letters, we add it to the search string
        if (book.word_data_array[x].height > (max_height * word_height_minimum)) {
            if (book.word_data_array[x].word.length > 3) {
                searchString += book.word_data_array[x].word + " ";
            }
        }
    }


    request({
      url: 'https://www.goodreads.com/search/index.xml',
      qs: {key: keys.goodreads.consumerKey, q: searchString}
    }, function(err, response, body) {
      responses.push({obj: book, resp: response});
      counter++;
      if (counter == jsonObj.length) {
        callback(parseResults(responses));
      }
    });
  }
};
