import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/**
 * This will render the App component and this component will take over from there
 */
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
