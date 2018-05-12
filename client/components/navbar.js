import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const { auth } = require('../../firebase/initFirebase');

const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false, // boolean, able to access user off auth.currentUser
      displayName: 'guest',
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // if there is a user logged in, change state of isLoggedIn to true
        this.setState({
          isLoggedIn: true,
          displayName: firebase.auth().currentUser.displayName,
        });
      } else {
        // no user, set state of isLoggedIn to false
        this.setState({ isLoggedIn: false });
      }
    });
  }

  componentWillUnmount() {
    // auth.onAuthStateChanged returns the unsubscribe function for the listener
    const unsubscribe = auth.onAuthStateChanged(() => {});
    unsubscribe(); // invoke the returned unsubscribe function
  }

  logout() {
    auth.signOut().then(() => {
      // Sign-out successful
      console.log('Sign-out successful: ', auth.currentUser);
    }, (error) => {
      // Log the error
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        <h1>DevBook()</h1>
        <nav>
          {this.state.isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Link to="/home">Home</Link>
              <Link to="/groups">Groups</Link>
              <Link to="/testSnippet">Notebooks</Link>
              <Link to="/groups/new">CreateGroup</Link>
              <Link to="/groups/Group 2">Show SingleGroup (DEMO)</Link>
              <Link to="/singleUser">Show SingleUser (DEMO)</Link>
              <h3>Welcome, {this.state.displayName}</h3>
              <Link onClick={this.logout} to="/login">Logout</Link>
            </div>
          ) : (
            <div>
              {/* The navbar will show these links before you log in */}
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/testSnippet">Example Snippet</Link>
            </div>
          )}
        </nav>
        <hr />
      </div>
    );
  }
}
