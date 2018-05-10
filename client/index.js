import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// local imports
import history from './history';
import store from './store';
import App from './app';


// establishes socket connection
import './socket';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('app'),
);
