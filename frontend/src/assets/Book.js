import React from 'react'
import PropTypes from 'prop-types'

import book_cover from "../images/default-book-cover.png"

//Style
import './Book.css'

/**
 * The book component, this component displays a book with its properties and functionalities.
 * @extends React
 */
class Book extends React.Component {
  constructor(props) {
    super(props);

    this.redirect = this.redirect.bind(this)
    this.state = {
      addOrDelete: props.onAddOrDelete || function() { alert('No actions implemented')},
      showInfo: props.showInfo || function() { alert('No extra info available')}
    }
  }

  /**
   * Redirect to a link if link is available
   * @method redirect
   */
  redirect(id) {
    if (this.props.link != null) {
      window.location.replace(this.props.link);
    }
  }

  render() {
    /**
     * This wil choose the right button to display based on the setting
     * @method rightButton
     * @return {String}
     */
    const rightButton = () => {
      switch (this.props.setting) {
        case 'add':
          return <i className="material-icons book-icon right-icon" onClick={() => this.state.addOrDelete(this.props.id)}>add</i>
        case 'delete':
          return <i className="material-icons book-icon right-icon" onClick={() => this.state.addOrDelete(this.props.id)}>delete</i>
        default:
          return;
      }
    }

    return (<div className='card'>
      <div className='cardContent'>
        <i className="material-icons book-icon left-icon" onClick={() => this.state.showInfo(this.props.id)}>info</i>
        {rightButton()}
        <img className='cover' src={this.props.image} alt='book cover'/>
        <div className='info'>
          <div className='title'>
            {this.props.title}
          </div>
          <div className='author'>
            {this.props.authors}
          </div>
        </div>
      </div>
    </div>)
  }
}

Book.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  year: PropTypes.number,
  authors: PropTypes.string,
  image: PropTypes.string,
  showInfo: PropTypes.func,
  onAddOrDelete: PropTypes.func
}

Book.defaultProps = {
  title: 'Title',
  image: book_cover
}

export default Book;
