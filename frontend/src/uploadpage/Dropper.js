import React from 'react'
import PropTypes from 'prop-types'

import Dropzone from 'react-dropzone'

// Style
import './Dropper.css';

/**
 * The Dropper component, this component manages the block in which picture can be uploaded
 * @extends React
 */
class Dropper extends React.Component {
	static propTypes = {
		onDrop: PropTypes.func.isRequired
	}

	constructor(props) {
        super(props)
        this.state = {
            files: []
        }
     }

	render () {
		return (
			<div className="dropzone">
			  <Dropzone
				  className="dropzoneContent"
				  accept="image/jpeg, image/png"
				  onDrop={this.props.onDrop.bind(this)}>
					<h3> Drop or click to upload! </h3>
			  </Dropzone>
			</div>
		)
	}
}

export default Dropper;
