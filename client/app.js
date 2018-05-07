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

  var citiesRef = db.collection("cities");

  citiesRef.doc("SF").set({
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000 });

    db.collection("cities").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log("SF:", doc.data());
      });
  });
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
