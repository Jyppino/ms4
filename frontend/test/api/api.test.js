// React/Test imports
import React from 'react';
import renderer from 'react-test-renderer';
import {shallow, mount} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Other imports
import {Header} from 'semantic-ui-react';
import {BrowserRouter, Link} from 'react-router-dom';

// Local imports
import api from './../../src/api/api.js';

Enzyme.configure({adapter: new Adapter()});

describe('api.js', () => {

  it('returns 4 shelves when shelves() is called', () => {
    api.shelves().then(response => {
      expect(response.data.shelves.length).toEqual(shelvesResponse.shelves.length)
    })
  })

  it('returns book addition status data when book()add() is called', () => {
    var mock = new MockAdapter(axios);

    mock.onGet('http://api.myshelf.nl/api/add_book?name=read&book_id=12043771').reply(200, addBookResponse);

    api.book().add('read', 12043771).then(response => {
      expect(response.data).toEqual(addBookResponse);
      done();
    });
  })

  it('returns book deletion status data when book()remove() is called', () => {
    var mock = new MockAdapter(axios);

    mock.onGet('http://api.myshelf.nl/api/remove_book?name=read&book_id=12043771').reply(200, removeBookResponse);

    api.book().remove('read', 12043771).then(response => {
      expect(response.data).toEqual(addBookResponse);
      done();
    });
  })

  it('returns book information data when book()info() is called', () => {
    var mock = new MockAdapter(axios);

    mock.onGet('http://api.myshelf.nl/api/book?id=3836').reply(200, bookSearchResponse);

    api.book().info(3836).then(response => {
      expect(response.data).toEqual(bookInformationResponse);
      done();
    });
  })

  it('returns search results when search() is called', () => {
    var mock = new MockAdapter(axios);

    mock.onGet('http://api.myshelf.nl/api/search?q=de%20vliegeraar').reply(200, bookSearchResponse);

    api.search('de vliegeraar').then(response => {
      expect(response.data).toEqual(bookSearchResponse);
      done();
    });
  })

  it('returns login status data when auth()status() is called', done => {
    var mock = new MockAdapter(axios);

    mock.onGet('http://api.myshelf.nl/auth/status').reply(200, statusResponse);

    api.auth().status().then(response => {
      expect(response.data).toEqual(statusResponse);
      done();
    });
  })

  it('returns profile data when profile is called', done => {
    var mock = new MockAdapter(axios);

    mock.onGet('http://api.myshelf.nl/api/profile').reply(200, profileResponse);

    api.profile().then(response => {
      expect(response.data).toEqual(profileResponse);
      done();
    });
  });
})

const shelvesResponse = {
  "shelves": [
    {
      "id": 265667210,
      "name": "read",
      "count": 33
    }, {
      "id": 265667209,
      "name": "currently-reading",
      "count": 2
    }, {
      "id": 265667208,
      "name": "to-read",
      "count": 1
    }, {
      "id": 266337597,
      "name": "personal",
      "count": 10
    }
  ]
}

const statusResponse = {
  "authenticated": false
}

const addBookResponse = {
  "statusCode": 201,
  "message": "Created"
}

const removeBookResponse = {
  "statusCode": 200,
  "message": "OK"
}

const bookInformationResponse = {
  "id": 3836,
  "title": "Don Quixote",
  "authors": [
    {
      "id": 4037220,
      "name": "Miguel de Cervantes Saavedra",
      "role": "Author"
    }, {
      "id": 69766,
      "name": "Roberto González Echevarría",
      "role": "Introduction"
    }, {
      "id": 492304,
      "name": "John Rutherford",
      "role": "Translator, Introduction"
    }, {
      "id": 3186817,
      "name": "Ernani Ssó",
      "role": "translator"
    }
  ],
  "link": "https://www.goodreads.com/book/show/3836.Don_Quixote",
  "isbn": "0142437239",
  "image_url": "https://images.gr-assets.com/books/1364958765m/3836.jpg",
  "publication_year": 1615,
  "description": "Don Quixote has become so entranced by reading chivalric romances, that he determines to become a knight-errant himself. In the company of his faithful squire, Sancho Panza, his exploits blossom in all sorts of wonderful ways. While Quixote's fancy often leads him astray – he tilts at windmills, imagining them to be giants – Sancho acquires cunning and a certain sagacity. Sane madman and wise fool, they roam the world together, and together they have haunted readers' imaginations for nearly four hundred years.<br /><br />With its experimental form and literary playfulness, <i>Don Quixote</i> generally has been recognized as the first modern novel. The book has had enormous influence on a host of writers, from Fielding and Sterne to Flaubert, Dickens, Melville, and Faulkner, who reread it once a year, \"just as some people read the Bible.\"",
  "average_rating": 3.86
}

const profileResponse = {
  "id": 81596543,
  "name": "MyShelf",
  "link": "https://www.goodreads.com/user/show/81596543-myshelf",
  "image": "https://images.gr-assets.com/users/1528795346p3/81596543.jpg",
  "shelves": [
    {
      "id": 265667210,
      "name": "read",
      "count": 32
    }, {
      "id": 265667209,
      "name": "currently-reading",
      "count": 2
    }, {
      "id": 265667208,
      "name": "to-read",
      "count": 1
    }, {
      "id": 266337597,
      "name": "personal",
      "count": 10
    }
  ]
}

const bookSearchResponse = {
  "results": [
    {
      "id": 807211,
      "title": "De vliegeraar",
      "authors": [
        {
          "id": 569,
          "name": "Khaled Hosseini",
          "role": "Author"
        }
      ],
      "image_url": "https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png"
    }, {
      "id": 22605828,
      "title": "De vliegeraar (de graphic novel)",
      "authors": [
        {
          "id": 569,
          "name": "Khaled Hosseini",
          "role": "Author"
        }
      ],
      "image_url": "https://images.gr-assets.com/books/1404143955m/22605828.jpg"
    }
  ]
}
