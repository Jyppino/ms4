// React/Test imports
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Other imports
import { Header, Grid } from 'semantic-ui-react';
import { BrowserRouter, Link } from 'react-router-dom';

// Local imports
import BookShelf from './../../src/assets/BookShelf.js';

Enzyme.configure({ adapter: new Adapter() });

describe('<BookShelf />', () => {
  it('should not contain books if empty shelf', () => {
    const wrapper = shallow(<BookShelf name='test' shelf={[]} />);
    expect(wrapper.find('Book').length).toBe(0);
  });

  it('should render one <Header> component', () => {
    const wrapper = shallow(<BookShelf name='test' shelf={[]} />);
    expect(wrapper.find(Header).length).toBe(1);
  });

  it('should contain a place for the books', () => {
    var testBooks = [
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"}
    ]
    const wrapper = shallow(<BookShelf name='test' shelf={testBooks} />);
    expect(wrapper.find('.shelf').exists()).toEqual(true);
  });

  it('should have the basis for a grid', () => {
    var testBooks = [
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"}
    ]
    const wrapper = shallow(<BookShelf name='test' shelf={testBooks} />);
    expect(wrapper.find(Grid).length).toBe(1);
  });

  it('should contain books if non-empty shelf', () => {
    var testBooks = [
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"}
    ]
    const wrapper = shallow(<BookShelf name='test' shelf={testBooks} />);
    expect(wrapper.find('Book').length).toBe(3);
  });

  it('should contain one book less if deleted', () => {
    var testBooks = [
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"},
      {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"}
    ]
    const wrapper = shallow(<BookShelf name='test' shelf={testBooks} />);
    wrapper.instance().deleteLocal(13326831)
    const status = wrapper.state().shelf.length;
    expect(status).toEqual(2);
  });

  it('createBook should return a new column containing a book', () => {
    var testBook = {id: 13326831, title: "The Testing (The Testing, #1)", authors: Array(1), image_url: "https://images.gr-assets.com/books/1363452191m/13326831.jpg"}
    const wrapper = shallow(<BookShelf name='test' shelf={[]} />);
    const newbook = shallow(wrapper.instance().createBook(testBook))
    expect(newbook.find('Book').length).toBe(1);
  });

});
