import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// local imports
import history from './history';
import App from './app';

ReactDOM.render(
  <Router history={history}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Router>
  document.getElementById('app'),
);
