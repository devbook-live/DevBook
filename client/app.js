import React, { Component } from 'react';
import { Navbar } from './components';
import Routes from './routes';
import { auth } from '../firebase/initFirebase';

class App extends Component {
  componentDidMount() {
    if (!auth.currentUser) auth.signInAnonymously();
  }
  render() {
    return (
      <div>
        <Navbar />
        <div className="main">
          <Routes />
        </div>
      </div>
    );
  }
}

export default App;
