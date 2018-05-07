import React, { Component } from 'react';

import { Navbar } from './components';
import Routes from './routes';
import db from '../firebase/initFirebase';


export default class App extends Component {
  componentDidMount() {

  //   db.collection("users").get().then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //         console.log(doc.data().last);
  //     });
  // });
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
