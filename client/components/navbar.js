/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { addUserFunction } from '../crud/user';
import history from '../history';


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
    let title = window.location.pathname.split('/');
    if (title[1] === 'notebooks' && title.length === 3) {
      title = `DevBook({ ${title[2]} })`;
    } else {
      title = 'DevBook( )';
    }
    return (
      <div>
        <AppBar
          title={<Link style={{ color: 'white', textDecoration: 'none' }}to="/">{title}</Link>}
          titleStyle={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '35px',
            textShadow: '2px 4px 3px rgba(0,0,0,0.3)',
          }}
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
    history.push('/login');
    console.log('Sign-out successful!');
  }, (error) => {
    // Log the error
    console.error(error);
  });
};
