import React from 'react'
import PropTypes from 'prop-types'

import api from '../api/api.js'
import { Grid, Header, Dimmer } from 'semantic-ui-react'

import BookPopup from './BookPopup.js'
import Book from './Book.js'

//Style
import './BookShelf.css'

/**
 * The BookShelf component, recieves an array of books and build a bookshelf accordingly
 * @extends React
 */
class BookShelf extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          shelf: props.shelf,
          overlay: false
        }

        this.createBook = this.createBook.bind(this)
        this.addBook = this.addBook.bind(this)
        this.deleteBook = this.deleteBook.bind(this)
        this.deleteLocal = this.deleteLocal.bind(this)

        this.handleOverlayOpen = this.handleOverlayOpen.bind(this)
        this.handleOverlayClose = this.handleOverlayClose.bind(this)
    }

    /**
     * Returns the correct book format to be put in the shelf according to the given parameters. It will choose between a delete function or the add function
     * @method createBook
     */
    createBook(book) {
        var authors = book.authors.map(author => author.name).toString()
        const onAddOrDelete = () => {
          switch (this.props.setting) {
            case 'add':
              return this.addBook
            case 'delete':
              return this.deleteBook
            default:
              return function() { 'Not implemented' }
          }
        }

        return (
          <Grid.Column className='bookColumn' key={ book.id } mobile={8} tablet={5} computer={3}>
            <Book id={ book.id }
        					title={ book.title.toString() }
        					authors={ authors }
        					image={ book.image_url }
        					showInfo={ this.handleOverlayOpen }
        					onAddOrDelete={ onAddOrDelete() }
                  setting={ this.props.setting }
    					/>
          </Grid.Column>
        )
    }

    /**
     * The add book functions adds books when the plus icon is clicked
     * @method addBook
     * @param  {integer} bookId [The book id is an integer and will be used to find the book]
     */
    addBook(bookId) {
      var shelfName = this.props.name
      var question = window.confirm("Do you want to add this book to the " + shelfName + " shelf? BOOK ID [" + bookId + "]");
      if (question) {
        api.book().add(shelfName, bookId).then(res => {
            console.log(res.data)
            alert("Added!")
          }).catch(function(error) {
            alert("Could not fetch from DB: " + error)
            console.log("Could not fetch from DB: " + error)
          })
      }
    }

    /**
     * The delete book function will delete a book from the given library
     * @method deleteBook
     * @param  {integer} bookId [The book id is an integer and will be used to find the book]
     */
    deleteBook(bookId) {
      var shelfName = this.props.name
      var question = window.confirm("Do you want to delete this book from the " + shelfName + " shelf? BOOK ID [" + bookId + "]");
      if (question) {
        api.book().remove(shelfName, bookId).then(res => {
            console.log(res.data)
            alert("Deleted!")
            this.deleteLocal(bookId)
          }).catch(function(error) {
            alert("Could not fetch from DB: " + error)
            console.log("Could not fetch from DB: " + error)
          })
      }
    }
    /**
     * Delete the book locally to prevent doing a new request when knowing the outcome
     * @method deleteLocal
     * @param  {Integer}    bookId [Use the bookId to search through our array]
     */
    deleteLocal(bookId) {
      var shelf = this.props.shelf
      console.log(shelf)
      for(var i = 0; i < shelf.length; i++) {
          if(shelf[i].id == bookId) {
              shelf.splice(i, 1);
              this.setState({
                shelf: shelf
              })
              break;
          }
      }
    }

    /**
     * Methods handling the closing and opening of a book overlay
     * @method handleOverlayOpen
     * @method handleOverlayClose
     */
    handleOverlayOpen(id) { this.setState({ overlay: true, selectedBook: id }) }
    handleOverlayClose() { this.setState({ overlay: false }) }

    render () {
        if (this.props.shelf.length === 0) {
            return (
      				<Header as='h1' textAlign='center'>
      					<Header.Content>
      						Sorry no books found...  ;(
      					</Header.Content>
      				</Header>
      			)
        } else {
            return (
                <div className='shelf'>
                    {/* Grid of books in the shelf */}
                  	<Grid>
                        { this.props.shelf.map(book => this.createBook(book)) }
                  	</Grid>

                    {/* The dimmed popup of a specific book is generated here */}
                    {this.state.overlay ? <BookPopup handleOverlayClose={this.handleOverlayClose} bookId={ this.state.selectedBook } />
                                        : null }

                </div>
            )
        }
    }
}

BookShelf.propTypes = {
      shelf: PropTypes.array.isRequired,
      name: PropTypes.string.isRequired,
      setting: PropTypes.string,
}

export default BookShelf;
