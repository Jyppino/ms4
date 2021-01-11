// React/Test imports
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Other imports
import { Header } from 'semantic-ui-react';
import { BrowserRouter, Link } from 'react-router-dom';

// Local imports
import Book from './../../src/assets/Book.js';

Enzyme.configure({ adapter: new Adapter() });

describe('<Book />', () => {
  // id={1} title='Moby Dick' authors='Roald Dahl' link='google.com'
  it('should contain a cover img', () => {
    const wrapper = mount(<Book id={1} />);
    //expect(wrapper.props().id).to.equal(1);
    expect(wrapper.find('img').length).toBe(1);
  });

  it('a book should have one button on no setting', () => {
    const wrapper = mount(<Book id={1} />);
    expect(wrapper.find('i').length).toBe(1);
  });

  it('a book should have a delete button on delete setting', () => {
    const wrapper = mount(<Book id={1} setting='delete'/>);
    expect(wrapper.find('i').length).toBe(2);
  });

  it('a book should have a delete button on add setting', () => {
    const wrapper = mount(<Book id={1} setting='add'/>);
    expect(wrapper.find('i').length).toBe(2);
  });

  it('a book should have a title', () => {
    const wrapper = mount(<Book id={1} setting='delete'/>);
    expect(wrapper.find('.title').exists()).toEqual(true);
  });

  it('a book should have an author', () => {
    const wrapper = mount(<Book id={1} authors='Roald Dahl' setting='delete'/>);
    expect(wrapper.find('.author').exists()).toEqual(true);
  });
});
