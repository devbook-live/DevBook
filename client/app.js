import React, { Component } from 'react';

import { Navbar } from './components';
import Routes from './routes';
import initFirebase from '../firebase/initFirebase';

export default class App extends Component {
  componentDidMount() {
    const app = initFirebase();
    console.log('initialized app: ', app);
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
