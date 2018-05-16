/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import history from '../history';
import { fetchUserFunction, addUserFunction } from '../crud/user';

// changes based on state.loggedInUser
import LoggedIn from './navbar-loggedIn';
import Login from './navbar-loggedOut';

// Material Ui imports
import AppBar from 'material-ui/AppBar';

const { db, auth } = require('../../firebase/initFirebase');
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: auth.currentUser, // boolean, able to access user off auth.currentUser
      displayName: 'guest',
    };
    // Bind functions
    this.logout.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // if there is a user logged in, change state of loggedInUser to user obj.
        this.setState({
          loggedInUser: user,
          displayName: auth.currentUser.displayName || auth.currentUser.email,
        });

        const { uid } = user;
        db.collection('users').doc(uid).get()
          .then((userExists) => {
            if (!userExists.data()) {
              const { email, displayName } = user;
              const userInfo = {
                displayName,
                email,
                id: uid,
                documents: {},
                groups: {},
              };
              addUserFunction(uid, userInfo);
            }
          });
      } else {
        // no user, set state of loggedInUser to false
        this.setState({ loggedInUser: undefined });
      }
    });
  }

  componentWillUnmount() {
    // auth.onAuthStateChanged returns the unsubscribe function for the listener
    const unsubscribe = auth.onAuthStateChanged(() => {});
    unsubscribe(); // invoke the returned unsubscribe function
  }

  render() {
    return (
      <div>
        <AppBar
          title="DevBook( )"
          showMenuIconButton={false}
          iconElementRight={this.state.loggedInUser ? <LoggedIn logout={this.logout} user={this.state.loggedInUser} /> : <Login />}
          style={{
            color: (0, 188, 212),
            fontFamily: 'sans-serif',
          }}
        />
      </div>
    );
  }
}

Navbar.prototype.logout = () => {
  auth.signOut().then(() => {
    // Sign-out successful
    console.log('Sign-out successful: ', auth.currentUser);
  }, (error) => {
    // Log the error
    console.error(error);
  });
};
