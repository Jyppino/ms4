import React from 'react'

import {Container, Header, Divider, Segment, Pagination } from 'semantic-ui-react'
import Loader from './../assets/Loader.js'
import axios from 'axios'

import BookShelf from '../assets/BookShelf.js'
import ShelfDropdown from '../assets/ShelfDropdown.js'
import SortDropdown from '../assets/SortDropdown.js'
import LocalSearchBar from '../assets/LocalSearchBar.js'
import BookPopup from '../assets/BookPopup.js'

//Style
import './Shelf.css'

/**
 * The Shelf component, this is a main component which fetches and displayes all shelfs of the current user.
 * @type {Object}
 */
export class Shelf extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      shelfName: 'read',
      sortBy: 'Title',
      currentShelf: [],
      isLoading: true,
      totalPages: 1,
      activePage: 1,
      overlay: false
    }

    //Selecting shelf
    this.handleShelfChange = this.handleShelfChange.bind(this);

    //Sorting shelf
    this.handleSortChange = this.handleSortChange.bind(this);
    this.sortShelf = this.sortShelf.bind(this)
    this.sortByYear = this.sortByYear.bind(this)
    this.sortByTitle = this.sortByTitle.bind(this)
    this.sortByAuthor = this.sortByAuthor.bind(this)

    //Selecting pageNumber
    this.handlePageChange = this.handlePageChange.bind(this)

    //Creating a searchable Object
    this.createSearchableObject = this.createSearchableObject.bind(this)
    this.handleSearchClick = this.handleSearchClick.bind(this)
    this.handleSearchClose = this.handleSearchClose.bind(this)
  }

  /**
   * The fetchShelf function will fetch the shelf with the given name from the API
   * @method fetchShelf
   * @param  {String}   shelfName [The name of the shelf]
   */
  fetchShelf(shelfName, pageNumber = 1) {
    console.log('Fetching shelf: ' + shelfName + ', on page: ' + pageNumber)
    axios.get('http://api.myshelf.nl/api/shelf', {
      withCredentials: true,
      params: {
        shelf: shelfName,
        page: pageNumber
      }
    }).then(res => {
      console.log(res)
      this.setState({
        isLoading: false,
        currentShelf: res.data.books,
        totalPages: res.data.numpages,
        activePage: pageNumber
      })
    }).catch(function(error) {
      alert("Could not fetch from DB: " + error)
      console.log("Could not fetch from DB: " + error)
    })
  }

  /**
   * Fetches shelf on mount of component
   * @method componentDidMount
   */
  componentDidMount() {
    // Query from DB
    this.fetchShelf(this.state.shelfName)
  }

  /**
   * Handles a change in the shelf selection and updates current shelf name
   * @method handleShelfChange
   * @param  {[type]}          newShelf [description]
   * @return {[type]}                   [description]
   */
  handleShelfChange(newShelf) {
    this.setState({isLoading: true, shelfName: newShelf})
    this.fetchShelf(newShelf)
  }

  /**
   * Handle the pagechange event by fetching a new shelf on a given page
   * @method handlePageChange
   */
  handlePageChange = (e, { activePage }) => {
    this.setState({isLoading: true})
    this.fetchShelf(this.state.shelfName, activePage)
  }

  /**
   * Select the right method for the given sorting setting
   * @method sortShelf
   */
  sortShelf(newSort) {
    console.log("Now sorting by: " + newSort)
    switch(newSort) {
      case 'Author': this.sortByAuthor(); break;
      case 'Year': this.sortByYear(); break;
      default: this.sortByTitle();
    }
  }

  /**
   * Sort the shelf based on the year
   * @method sortByYear
   */
  sortByYear() {
    this.setState({
      currentShelf: this.state.currentShelf.sort(function(a,b) {
        return a.year - b.year;
      })
    });
  }

  /**
   * Sort the shelf alphabetically based on writer
   * @method sortByAuthor
   */
  sortByAuthor() {
    this.setState({
      currentShelf: this.state.currentShelf.sort(function(a, b){
          if(a.authors[0].name < b.authors[0].name) return -1;
          if(a.authors[0].name > b.authors[0].name) return 1;
          return 0;
      })
    });
  }

  /**
   * Sort the shelf alphabetically based on the title
   * @method sortByTitle
   */
  sortByTitle() {
    this.setState({
      currentShelf: this.state.currentShelf.sort(function(a, b){
          if(a.title < b.title) return -1;
          if(a.title > b.title) return 1;
          return 0;
      })
    });
  }

  /**
   * Handle a change in sort setting in the dropdown menu
   * @method handleSortChange
   * @param  {String}         newSort [The new sorting setting]
   */
  handleSortChange(newSort) {
    this.setState({sortBy: newSort})
    this.sortShelf(newSort)
  }

  /**
   * Create a searchable object
   * @method createSearchableObject
   * @return {[type]} [description]
   */
  createSearchableObject(book) {
    return (
      {
        'id': book.id,
        'title': book.title,
        'description': book.authors.map(author => author.name).toString()
      }
    )
  }

  /**
   * Methods handling the showing of info when a search result is selected
   * @method handleSearchClick
   * @method handleSearchClose
   */
  handleSearchClick(id) { this.setState({ overlay: true, selectedBook: id }) }
  handleSearchClose() { this.setState({ overlay: false }) }

  render() {
    const loadedBooks = this.state.isLoading
      ? (<div className='loader'><Loader/></div>)
      : (<BookShelf shelf={this.state.currentShelf} name={this.state.shelfName.toString()} setting='delete' />);

    return (<Container className='pageContainer'>
      <Header as='h1' className='pageHeader'>
        Your Shelf
        <Header.Subheader>
          This is your shelf! Here you can view your personal catalogs. Browse through your books and
        </Header.Subheader>
        <Header.Subheader>
          find something to read!
        </Header.Subheader>
      </Header>
      <div className='segmentHeader'>
        <SortDropdown handleChange={this.handleSortChange}/>
        <LocalSearchBar onSearchSelect={this.handleSearchClick} options={ this.state.currentShelf.map(book => this.createSearchableObject(book)) }/>
        <ShelfDropdown handleChange={this.handleShelfChange}/>
      </div>
      <Divider/> {loadedBooks}
      <Divider/>

      {/* The dimmed popup of a specific book is generated here */}
      {this.state.overlay ? <BookPopup handleOverlayClose={this.handleSearchClose} bookId={ this.state.selectedBook } />
                          : null }

      <div className='segmentFooter'>
        <Pagination
          defaultActivePage={1}
          activePage={this.activePage}
          onPageChange={this.handlePageChange}
          boundaryRange={20}
          totalPages={this.state.totalPages} />
      </div>
    </Container>)
  }
}
