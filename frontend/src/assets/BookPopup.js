import React from 'react'
import PropTypes from 'prop-types'

import { Dimmer } from 'semantic-ui-react'
import BookInfo from './BookInfo.js'

/**
 * Dimmes the pages and shows info about the selected book
 * @extends React
 */
class BookPopup extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <Dimmer active={true} onClickOutside={this.props.handleOverlayClose} page>
          <BookInfo onClose={this.props.handleOverlayClose} bookId={ this.props.bookId } />
      </Dimmer>
    )
  }
}

BookPopup.propTypes = {
  bookId: PropTypes.number,
  handleOverlayClose: PropTypes.func
}

export default BookPopup;
