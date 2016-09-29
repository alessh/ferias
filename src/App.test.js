import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import moment from 'moment';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App date={moment().utc()} />, div);
});
