import React from 'react'
import PropTypes from 'prop-types'

import api from '../api/api.js'
import { Container, Header, Divider } from 'semantic-ui-react'

import Loader from './Loader.js'

// Style
import './BookInfo.css'


/**
 * The BookInfo component, this module will display all information of a single book.
 * @extends React
 */
class BookInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      book: null,
      bookId: props.bookId || '',
      isLoading: true
    }
  }

  /**
   * Fetch info about the book with the given id on load
   * @method componentDidMount
   */
  componentDidMount() {
    api.book().info(this.state.bookId).then(res => {
      this.setState({
        book: res.data,
        isLoading: false
      })
    }).catch(error => {
      alert("Could not fetch from DB: " + error)
      console.log("Could not fetch from DB: " + error)
    })
  }

  /**
   * Render the book once its fetched from the database, else display the loader
   * @method render
   * @return {[type]} [description]
   */
  render () {
    const book = this.state.book

    /**
     * Create the markup from the dangerouslySetInnerHTML recieved from the database
     * @method createMarkup
     */
    function createMarkup() { return {__html: book.description}; };

    console.log(book)
    const loadedContent = this.state.isLoading
      ? (<div className='loader'><Loader/></div>)
      : (<div>
          <div className='backToShelf' onClick={this.props.onClose}>&#8617; Go back</div>
          <img className='bookCover' src={book.image_url} alt='book cover'/>
          <Header as='h1' className='titleHeader'>
            { book.title } ({book.publication_year})
            <Header.Subheader>
              { book.authors.map(author => author.name).toString() }
            </Header.Subheader>
            <Header.Subheader>
              ISBN: { book.isbn }
            </Header.Subheader>
          </Header>
          <Divider />
          <div className='bookDescription' dangerouslySetInnerHTML={createMarkup()} />
      </div>);

    return (
      <div>
        <Container className='infoContainer'>
          { loadedContent }
        </Container>
      </div>
    )
  }
}

export default BookInfo;
