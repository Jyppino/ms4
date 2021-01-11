import React from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import api from '../api/api.js'
import { Segment, Header, Icon, Divider, Input, Button } from 'semantic-ui-react'

import Loader from './../assets/Loader.js'
import BookShelf from '../assets/BookShelf.js'
import SearchBar from './SearchBar.js'
import Dropper from './Dropper.js'
import ShelfDropdown from '../assets/ShelfDropdown.js'

// style
import './ExtraNav.css'

/**
 * A board which return the books returned when searching for a query
 * @extends React
 */
class SearchBoard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			files: [],
			searchFor: props.searchFor || '',
			isLoading: true,
			results: [],
			selectedShelf: 'read'
		}

		this.handleSearch = this.handleSearch.bind(this)
		this.searchForBooks = this.searchForBooks.bind(this)
	}

	/**
	 * Initiates search if searchFor is not empty
	 * @method componentDidMount
	 */
	componentDidMount() {
		if (this.state.searchFor != '') {
			this.searchForBooks(this.state.searchFor)
		}
	}

	/**
	 * Function which fetches the books for a given string
	 * @method searchForBooks
	 * @param  {String}       query [The query to be searched for]
	 */
	searchForBooks(query) {
		// Search call for 'value' state
		console.log('Looking for books...')
		api.search(query, 'all').then(res => {
				console.log(res.data)
				this.setState({
					isLoading: false,
					results: res.data.results
				})
			}).catch(function(error) {
				alert("Could not fetch from DB: " + error)
				console.log("Could not fetch from DB: " + error)
			})
	}

	/**
	 * Set state to loading and handle the search when a query is done
	 * @method handleSearch
	 * @param  {String}     input [The search string]
	 */
	handleSearch(input) {
		this.setState({
			isSearching : true,
			isLoading : true
		})
		this.searchForBooks(input)
	}

	render () {
		const loadedBooks = this.state.isLoading ? (
			<div className='loader'><Loader /></div>
		) : (
			<BookShelf shelf={this.state.results} name={this.state.selectedShelf} setting='add' />
		);


		return (
			<Segment padded raised>
				<div className='segmentHeader'>
					<div className='goback' onClick={this.props.goBack}>&#8617; Go back</div>
					<SearchBar handleSearch={this.handleSearch} placeHolder={this.state.searchFor}/>
					<ShelfDropdown handleChange={(selected) => this.setState({selectedShelf: selected})} />
				</div>
				{loadedBooks}
			</Segment>
		)
	}
}

SearchBoard.propTypes = {
	goBack: PropTypes.func
}

export default SearchBoard;
