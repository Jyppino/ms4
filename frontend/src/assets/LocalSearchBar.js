import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import { Search, Grid, Header } from 'semantic-ui-react'

/**
 * This is a searchbar for a local shelf
 * @extends React
 */
class LocalSearchBar extends React.Component {

  /**
   * Reset component on mount
   * @method componentWillMount
   * @return {[type]}           [description]
   */
  componentWillMount() {
    this.resetComponent();
  }

  /**
   * Resets the searchbar
   * @method resetComponent
   */
  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  /**
   * Responds when the search query is selected
   * @method handleResultSelect
   */
  handleResultSelect = (e, { result }) => { this.props.onSearchSelect(result.id); this.resetComponent() }

  /**
   * Responds when the search query is changed
   * @method handleResultSelect
   */
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.props.options, isMatch),
      })
    }, 300)
  }

  render () {
    const { isLoading, value, results } = this.state

    return (
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
          results={results}
          value={value}
          {...this.props}
        />
    )
  }
}

export default LocalSearchBar;
