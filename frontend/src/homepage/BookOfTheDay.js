import React from 'react'
import PropTypes from 'prop-types'
import api from '../api/api.js'
import placeholder_image from "../images/default-book-cover.png"

import {Header, Divider, Rating} from 'semantic-ui-react'

//Style
import './BookOfTheDay.css'

/**
 * This compoment shows a book with a title, author, year and description
 * It needs a prop bookId to get information on a book
 * @extends React
 */
class BookOTDay extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: 'Title',
      author: 'Author',
      img: placeholder_image,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      rating: 5,
      year: 1234
    }
  }

  /**
   * makes an axios call to the main server to retrieve relevant data on a book
   */
  componentDidMount() {
    var book_id = this.props.bookId;

    api.book().info(book_id).then(res => {
      this.setState({
        isLoading: false,
        title: res.data.title,
        author: res.data.authors[0].name,
        img: res.data.image_url,
        year: res.data.publication_year,
        description: res.data.description,
        rating: res.data.average_rating
      })
    })
  }

  /**
     * Create the markup from the dangerouslySetInnerHTML recieved from the database
     * @method createMarkup
     */
  createMarkup(text) {
    return {__html: text};
  };

  render() {
    return (<div>
      <Header as='h3'>Book of the day</Header>
      <Divider/>
      <div className='bookOTDContainer'>
        <div className='imageAndRatingContainer'>
          <img className='bookCover' src={this.state.img}/>
        </div>
        <div className='informationContainer'>
          <Header className='titleAuthorHeader' as='h4'>{this.state.title}
            ({this.state.year})
            <Header.Subheader>{this.state.author}</Header.Subheader>
            <Rating className='ratingStars' rating={Math.round(this.state.rating)} maxRating={5} disabled/>
          </Header>

          <p dangerouslySetInnerHTML={this.createMarkup(this.state.description)}></p>
        </div>
      </div>
    </div>)
  }
}

export default BookOTDay;
