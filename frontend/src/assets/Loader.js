import React from 'react'

import './Loader.css'

/**
 * A loaders which can be displayed when books are loading
 * @extends React
 */
class Loader extends React.Component {
    render () {
        return (
            <div className="bookAnimation">
                <div className="book__page"></div>
                <div className="book__page"></div>
                <div className="book__page"></div>
            </div>
        )
    }
}

export default Loader;
