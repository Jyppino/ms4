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
import { Login } from './../../src/loginpage/Login.js';

Enzyme.configure({ adapter: new Adapter() });

describe('<Login />', () => {
  it('should render two <Header> components', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find(Header).length).toBe(2);
  });

  it('should render one <Link /> component', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find(Link).length).toBe(1);
  });

  test('should have default state from = / ', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.state('from')).toBe('/');
  });

  it('should have state from =/home when prop location state from = /home', () => {
    let props = {
      location: {
        state: {
          from : '/home'
        }
      }
    };
    const wrapper = shallow(<Login {...props}/>);
    expect(wrapper.state('from')).toBe('/home');
  });
});
