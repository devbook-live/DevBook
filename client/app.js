import React, { Component } from 'react';
import axios from 'axios';
import { Navbar } from './components';
import Routes from './routes';
import { auth } from '../firebase/initFirebase';

const dockerClients = {
  node: 'https://node-docker-client.herokuapp.com',
  scala: 'https://scala-docker-client.herokuapp.com',
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverAwake: false,
    };
  }

  componentDidMount() {
    if (!auth.currentUser) auth.signInAnonymously();
    axios.get(dockerClients.node)
      .then(res => res.data)
      .then((data) => {
        if (data === 'Hello World!') this.setState({ serverAwake: true });
      })
      .catch(err => console.error('Unable to connect to docker client', err));
  }
  render() {
    return (
      <div>
        <Navbar />
        <div className="main">
          <Routes serverAwake={this.state.serverAwake} />
        </div>
      </div>
    );
  }
}

export default App;
