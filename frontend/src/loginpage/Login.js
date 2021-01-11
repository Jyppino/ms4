import React from 'react'

import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'
import styles from './Login.css'

/**
 * The login component, this component check if you came from login or somewhere else.
 * @type {Object}
 * @extends React
 */
export class Login extends React.Component {

  constructor(props) {
    super(props)
    var from;

    if (this.props.location == null) {
      from = '/'
    } else {
      from = this.props.location.state && this.props.location.state.from;
    }
    this.state = { from: from}

    console.log("Redirected to login from: " + from)
  }

  render () {

    return (
        <div className="ui middle aligned center aligned grid">
            <div className="column">

              <Header as='h1' className="ui header">Welcome to MyShelf</Header>

              <Header as='h3'>To login please press the button and login with your goodreads credentials</Header>

              <Link className="ui fluid blue submit button" to={{pathname: '/auth/success', state: { from: this.state.from }}}>Login</Link>

            </div>
        </div>
    )
  }
}
