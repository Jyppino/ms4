import React from 'react'
import PropTypes from 'prop-types'

import { Icon, Input } from 'semantic-ui-react'

// Style
import './SearchBar.css'

class SearchBar extends React.Component {
	static propTypes = {
		handleSearch : PropTypes.func.isRequired
	}

	constructor(props) {
		super(props)
		this.state = {
			searchFor: props.searchFor || ''
		}
	}

	render () {
		return (
			<div className="searchbar">
				<Input 	className="searchInput"
						onChange={e => this.setState({ searchFor: e.target.value })}
						id='searchBar'
						icon={<Icon name='search' inverted circular link />}
						placeholder='Search...'
						onKeyPress={e => {
						if (e.key === 'Enter') {
						  this.props.handleSearch(this.state.searchFor.toString())
					  }}
				  }/>
		    </div>
		)
	}
}

export default SearchBar;
