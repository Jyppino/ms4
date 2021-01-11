import React from 'react'

import axios from 'axios'
import api from '../api/api.js'
import {Container, Header, Divider, Image} from 'semantic-ui-react'
import Loader from './../assets/Loader.js'
import BookShelf from './../assets/BookShelf.js'
import BookOTDay from './BookOfTheDay.js'

// Style
import './Home.css'
import placeholder_image from "../images/default-book-cover.png"

/**
 * Home component, on this page relevant data about the user and his/her books will be displayed
 * @type {Object}
 */
export class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      recentShelf: [],
      userName: 'User',
      profilePicture: placeholder_image,
      bookOTDId: '3836'
    }
  }

  /**
   * makes an axios call to the main server to retrieve the username and user image
   * call the getRecentBooks function afterwars
   */
  componentDidMount() {
    api.profile().then((response) => {
      this.setState({userName: response.data.name, profilePicture: response.data.image})
    })
    this.getRecentBooks()
  }

  /**
   * makes an axios call to the main server to retrieve the recent books.
   * In this case, the recent books are the ones on the 'read' shelf
   * when done it sets the isLoading state to false
   */
  getRecentBooks() {
    api.shelf('read').then((response) => {
      this.setState({recentShelf: response.data.books, isLoading: false})
    })
  }

  render() {

    const profilePicture = this.state.isLoading
      ? (<div className='loader'><Loader/></div>)
      : (<img className='profilePicture' src={this.state.profilePicture}/>)

    const recentBooks = this.state.isLoading
      ? (<div className='loader'><Loader/></div>)
      : (<BookShelf shelf={this.state.recentShelf.slice(0, 3)} name='recent'/>);

    return (<Container className='pageContainer'>
      <Header as='h1' className='pageHeader'>
        {this.state.userName}&apos;s Homepage
        <Header.Subheader>
          This is your homepage! Here you can view all recent updates and all other relevant information to you.
        </Header.Subheader>
      </Header>
      <Divider/>
      <div className='contentContainer'>
        <div className='profileInformation'>
          <Header as='h3'>Welcome</Header>
          {profilePicture}
        </div>

        <div className='recentBooksContainer'>
          <Header as='h3'>These are your most recently read books</Header>
          {recentBooks}
        </div>

      </div>
      <Divider/>
      <BookOTDay bookId={this.state.bookOTDId}/>
    </Container>)
  }
}
