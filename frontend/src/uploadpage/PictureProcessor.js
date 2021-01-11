import React from 'react'

import axios from 'axios'
import {Container, Segment, Header, Divider} from 'semantic-ui-react'

import Loader from './../assets/Loader.js'
import BookShelf from '../assets/BookShelf.js'

import ShelfScanner from './ShelfScanner.js'

import SearchBar from './SearchBar.js'
import SearchBoard from './SearchBoard.js'

import Dropper from './Dropper.js'
import ShelfDropdown from '../assets/ShelfDropdown.js'

// Style
import './PictureProcessor.css'

/**
 * The PictureProcessor component, this component manages all search posibilities and hosts the main application.
 * - Hosts a searchbar for manual search
 * - Hosts a dropper for dropping a picture into the picture processor
 * @type {Object}
 */
export class PictureProcessor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      picture: null,
      searchFor: 'default',
      view: 'default',
      isLoading: false,
      results: [],
      selectedShelf: 'read'
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  /**
   * Change view when searching and handle search input
   * @method handleSearch
   * @param  {[type]}     input [description]
   * @return {[type]}           [description]
   */
  handleSearch(input) {
    this.setState({view: 'search', searchFor: input})
  }

  /**
   * Change the view when an image is dropped and handle the image
   * @method onDrop
   * @param  {file} dropped [Dropped image]
   */
  onDrop(dropped) {
    this.setState({
      view: 'drop',
      picture: dropped[dropped.length - 1]
    })
  }

  /**
   * To go back to the initial page when the navigation is clicked
   * @method goBack
   */
  goBack() {
    this.setState({
      view: 'default'
    })
  }

  render() {
    const searchResults = () => {
      switch (this.state.view) {
        case 'search':
          return <SearchBoard searchFor={this.state.searchFor}  goBack={this.goBack}/>
        case 'drop':
          return <ShelfScanner img={this.state.picture}  goBack={this.goBack}/>
        default:
          return (<Segment padded="padded" raised="raised">
            <Dropper onDrop={this.onDrop}/>
            <Divider horizontal="horizontal">Or search for books manually!</Divider>
            <SearchBar handleSearch={this.handleSearch}/>
          </Segment>)
      }
    }

    return (<Container className='pageContainer'>
      <div className='uploadHeader'>
        <Header as='h1' textAlign='center'>
          Turn your bookshelf digital!
          <Header.Subheader>
            Search our database for books or upload a picture of your shelf
          </Header.Subheader>
          <Header.Subheader>
            at home and let us do it for you!
          </Header.Subheader>
        </Header>
      </div>
      {searchResults()}
    </Container>);
  }
}
