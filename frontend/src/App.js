import React, {Component} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import axios from 'axios';

import {Login} from './loginpage/Login.js'
import Authentication from './loginpage/Authentication.js'
import {NavBar} from './navigation/NavBar.js'

// Style
import './App.css';

function PrivateRoute({
  component: Component,
  path,
  ...rest
}) {
  var authed = localStorage.getItem('authenticated');
  var parsedAuth = JSON.parse(authed);
  return (<Route {...rest} render={(
      props) =>
      parsedAuth === true
      ? <Component {...props}/>
      : <Redirect to={{
          pathname: '/login',
          state: {
            from: path
          }
        }}/>}/>)
}

/**
 * App is the main component and will route through to the other component if authenticated
 * @extends Component
 */
class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.isAuthenticated()
  }

  isAuthenticated() {
    console.log("authenticating")
    axios.get(`http://api.myshelf.nl/auth/status`, {withCredentials: true})
    .then(res => {
      const auth = res.data.authenticated;
      if (auth) {
        localStorage.setItem('authenticated', 'true');
      } else {
        localStorage.setItem('authenticated', 'false');
      }
    })
    .catch(error => { 
      localStorage.setItem('authenticated', 'false');
    })
  }

  render() {
    return (<BrowserRouter>
      <div>
        <Switch>
          <PrivateRoute exact path='/' component={NavBar}/>
          <Route path="/auth/success" component={Authentication}/>
          <Route path="/login" component={Login}/>
          <PrivateRoute path="/home" component={NavBar}/>
          <PrivateRoute path="/shelf" component={NavBar}/>
          <PrivateRoute path="/upload" component={NavBar}/>
          <PrivateRoute path='/recommendations' component={NavBar} />
        </Switch>

      </div>
    </BrowserRouter>);
  }
}

export default App
