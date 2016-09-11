import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import moment from 'moment';

ReactDOM.render(
  <App date={moment().utc()} />, document.getElementById('root')
);
