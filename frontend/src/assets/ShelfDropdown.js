import React from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import { Menu, Dropdown } from 'semantic-ui-react'

/**
 * A dropdown menu for selecting a shelf from the users different shelfs
 * @extends React
 */
class ShelfDropdown extends React.Component {
	static propTypes = {
		handleChange: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			options: [],
			selected: 'Fetching...'
		}
	}

/**
 * Fetches the shelfs on mount so the dropdown menu can give these as option
 * @method componentDidMount
 */
	componentDidMount() {
		axios.get('http://api.myshelf.nl/api/profile', {
			withCredentials: true
		}).then(res => {
			this.setState({
				isLoading : false,
				options: res.data.shelves.map(shelf => {
						const option = {};
						option.key = shelf.id;
						option.text = shelf.name;
						option.value = shelf.name;
						return option
					}),
				selected: res.data.shelves[0].name
			})
		}).catch(function(error) {
			console.log("Could not fetch from DB: " + error)
		})
	}

	render () {
		return (
			<Menu compact>
			  	<Dropdown text={this.state.selected}
						onChange={(e, data) => { this.props.handleChange(data.value); this.setState({selected : data.value.toString()})}}
						options={this.state.options}
						loading={this.state.isLoading}
						simple item />
			</Menu>
		)
	}
}

export default ShelfDropdown;
