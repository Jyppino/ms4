import React from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

/**
 * Opens a window in which you can login with your goodreads credentials.
 * Keeps track if the window is still there, if so -> check if logged in and redirect to page you came from
 * @extends React
 */
class Authentication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  /**
   * The window check is done here for the first time
   * @method componentDidMount
   */
  componentDidMount() {
    const url = 'http://api.myshelf.nl/auth/login';
    var win = window.open(url, 'Good reads', 'width=970,height=750');
    var timer = setInterval(() => {
      if (win.closed) {
        console.log('window closed');
        clearInterval(timer);
        axios.get(`http://api.myshelf.nl/auth/status`, {withCredentials: true})
        .then(res => {
          const auth = res.data.authenticated;
          if (auth) {
            localStorage.setItem('authenticated', 'true');
          } else {
            localStorage.setItem('authenticated', 'false');
          }
          return auth;
        })
        .then(auth => {
          this.setState({redirect: true})
        })
        .catch(error => {
          console.log(error);
        })
      }
    }, 1000);
  }

  render() {

    var from = this.props.location.state && this.props.location.state.from
    console.log(from);

    const redirect = !this.state.redirect
      ? <p>Waiting to be authenticated</p>
      : <Redirect to={from}/>

    return (<div>
      {redirect}
    </div>)
  }
}

export default Authentication;
