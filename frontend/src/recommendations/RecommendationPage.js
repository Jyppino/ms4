import React from 'react'
import PropTypes from 'prop-types'
import BookShelf from './../assets/BookShelf.js'
import {Header, Container, Divider} from 'semantic-ui-react'

import ShelfDropdown from '../assets/ShelfDropdown.js'
import api from './../api/api.js'

class RecommendationPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      recommendations: {},
      shelfName: 'read',
      isLoading: true
    }

    this.sortRecommendations = this.sortRecommendations.bind(this)
    this.retrieveBooks = this.retrieveBooks.bind(this)
    this.retrieveSimilarBooks = this.retrieveSimilarBooks.bind(this)
    this.handleShelfChange = this.handleShelfChange.bind(this);
    this.updateRecommendations = this.updateRecommendations.bind(this);
  }

  /**
   * Loads all the books on the read shelf, then for each of those books it
   * retrieves the similar books. These are then stored in an array.
   * When all books are stored in the array, the occurence of each book is
   * counted, by id.
   * Does this by calling updateRecommendations
   */
  componentDidMount() {
    this.updateRecommendations()
  }

  /**
   * Handles a change in the shelf selection and updates current shelf name
   * @method handleShelfChange
   * @param  {[type]}          newShelf [description]
   * @return {[type]}                   [description]
   */
  handleShelfChange(newShelf) {
    this.setState({isLoading: true, shelfName: newShelf})
    this.updateRecommendations()
  }

  /**
   * Updates the recommendations.
   * Retrieves all books on a certain shelf (this.state.shelfName)
   * and then finds all similar books for those books.
   * Counts how often a similar book appears
   * @return updates this.state.recommendations
   */
  updateRecommendations() {
    this.clearRecommendations();

    this.retrieveBooks(this.state.shelfName).then(books => {
      return books.map(book => book.id);
    }).then(book_ids => {
      book_ids.forEach(book_id => {
         // Retrieve the list of similar books for a certain book
        this.retrieveSimilarBooks(book_id)
        .then(similar_books => {
          similar_books.forEach(similar_book => {
            var new_recommendations = this.state.recommendations;
            var count = this.state.recommendations[similar_book.id]
              ? this.state.recommendations[similar_book.id].count + 1
              : 1
            similar_book.count = count
            new_recommendations[similar_book.id] = similar_book
            this.setState({
              recommendations: new_recommendations,
            })
          })
        })
      })
    })
  }

  async clearRecommendations() {
    await this.setState({
      recommendations: {}
    })
  }

  /**
   * Sort the recommendations based on their count value
   * @return {[book]} List of books sorted by count value from high to low
   */
  sortRecommendations() {
    var sorted_recommendations = Object.values(this.state.recommendations);
    if (sorted_recommendations.length > 0) {
      sorted_recommendations.sort(function(a, b) {
        var key1 = a.count,
          key2 = b.count;
        if (key1 < key2)
          return 1;
        if (key1 > key2)
          return -1;
        return 0;
      })
    }
    return sorted_recommendations;
  }

  /**
   * Retrieves book from specied shelf
   * @param  {string}  shelfname Name of the shelf to retrieve books from
   * @return {Promise} List of books on the specified shelf
   */
  async retrieveBooks(shelfname) {
    var books = []
    await api.shelf(shelfname, 200).then(res => {
      books = res.data.books;
    })
    return books
  }

  /**
   * Retrieves similar books of a book
   * @param  {int}  book_id Id of book to retrieve
   * @return {Promise} List of similar book ids
   */
  async retrieveSimilarBooks(book_id) {
    var similar_book_ids = []
    await api.book().info(book_id).then(res => {
      similar_book_ids = res.data.similar_books; //.map(similar_book => similar_book.id);
    })
    return similar_book_ids;
  }

  render() {
    return (<Container className='pageContainer'>
      <Header as='h1'>
        Recommendations
        <Header.Subheader>
          Based on the books you read, you will probably like these books as well.
        </Header.Subheader>
      </Header>
      <ShelfDropdown handleChange={this.handleShelfChange}/>
      <Divider/>
      <BookShelf shelf={this.sortRecommendations().slice(0, 50)} name='recommendations'/>
    </Container>)
  }
}

export default RecommendationPage;
