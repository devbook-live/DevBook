/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
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
        // if there is a user logged in, change state of loggedInUser to true
        this.setState({
          loggedInUser: user,
          displayName: auth.currentUser.displayName,
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
            fontFamily: 'Lucida Grande',
          }}
        />
      </div>
    );
  }
}

//        <div>
//         <h1>DevBook()</h1>
//         <nav>
//           {this.state.loggedInUser ? (
//             <div>
//               {/* The navbar will show these links after you log in */}
//               <Link to="/home">Home</Link>
//               <Link to="/groups">Groups</Link>
//               <Link to="/testSnippet">Notebooks</Link>
//               <Link to="/groups/new">CreateGroup</Link>
//               <Link to="/groups/Group 2">Show SingleGroup (DEMO)</Link>
//               <Link to="/singleUser">Show SingleUser (DEMO)</Link>
//               <h3>Welcome, {this.state.displayName}</h3>
//               <Link onClick={this.logout} to="/login">Logout</Link>
//             </div>
//           ) : (
//             <div>
//               {/* The navbar will show these links before you log in */}
//               <Link to="/login">Login</Link>
//               <Link to="/signup">Sign Up</Link>
//               <Link to="/testSnippet">Example Snippet</Link>
//             </div>
//           )}
//         </nav>
//         <hr />
//       </div>

Navbar.prototype.logout = () => {
  auth.signOut().then(() => {
    // Sign-out successful
    console.log('Sign-out successful: ', auth.currentUser);
  }, (error) => {
    // Log the error
    console.error(error);
  });
};
