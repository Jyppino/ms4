import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Dropdown } from 'semantic-ui-react'

/**
 * SortDropdown is a module which displays a dropdown with different kinds of sort settings
 * @extends React
 */
class SortDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [
        { key: 1, text: 'Title', value: 'Title' },
        { key: 2, text: 'Author', value: 'Author' },
        // { key: 3, text: 'Year', value: 'Year' }, NOT YET IMPLEMENTED BY SERVER
      ],
      selected: 'Title'
    }
  }

  render () {
    return (
      <div>Sort by: &nbsp;
  			<Menu compact>
  			  	<Dropdown text={this.state.selected}
  						onChange={(e, data) => { this.props.handleChange(data.value); this.setState({selected : data.value.toString()})}}
  						options={this.state.options}
  						simple item />
  			</Menu>
      </div>
		)
  }
}

SortDropdown.propTypes = {
  handleChange: PropTypes.func.isRequired
}

export default SortDropdown;
