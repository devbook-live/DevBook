import React, { Component } from 'react';

import { Navbar } from './components';
import Routes from './routes';

const { auth, db } = require('../firebase/initFirebase');

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar />
        <Routes />
      </div>
    );
  }
}
