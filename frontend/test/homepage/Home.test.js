// React/Test imports
import React from 'react';
import renderer from 'react-test-renderer';
import {shallow, mount} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';

// Other imports
import {Header} from 'semantic-ui-react';
import {BrowserRouter, Link} from 'react-router-dom';

// Local imports
import {Home} from './../../src/homepage/Home.js';

Enzyme.configure({adapter: new Adapter()});

describe('<Home />', () => {

  it('should render three <Header> components', () => {
    const wrapper = shallow(<Home/>);
    expect(wrapper.find(Header).length).toBe(3);
  })

  it('should render one <Header.Subheader> component', () => {
    const wrapper = shallow(<Home/>);
    expect(wrapper.find(Header.Subheader).length).toBe(1);
  })

})
