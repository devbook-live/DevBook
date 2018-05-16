/* eslint-disable no-shadow */
/* eslint-disable max-len */

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { Card } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import history from '../history';

const { auth } = require('../../firebase/initFirebase');

const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

/**
 * COMPONENT
 */
class AuthForm extends Component {
  // This changes the state of formName by forcing a rerender when the component didnt change
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.url.slice(1) !== prevState.formName) {
      return { formName: nextProps.match.url.slice(1) };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      formName: this.props.match.url.slice(1),
      email: '',
      password: '',
    };

    // binding this
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    const change = {};
    change[name] = value;
    this.setState(change);
  }

  // With login, can access current user with auth.currentUser (currentUser.uid = user id)
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { formName } = this.state;
    const email = evt.target.email.value;
    const password = evt.target.password.value;

    const loginFunc = async (email, password) => {
      // only creates user if it's the signup form
      if (formName === 'signup') {
        await auth.createUserWithEmailAndPassword(email, password);
      }
      // always runs sign in on either login or signup form
      await auth.signInWithEmailAndPassword(email, password);
    };
    loginFunc(email, password).catch(err => console.error(err));
  }

  signInWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleProvider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const { accessToken } = result.credential;
      // The signed-in user info.
      const { user } = result;
      // ...
    })
      .catch((error) => {
        const { errorCode, errorMessage, email, credential } = error;
      });
  }

  signInWithGithub = () => {
    const githubProvider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(githubProvider).then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const { accessToken } = result.credential;
      // The signed-in user info.
      const { user } = result;
      // ...
    })
      .catch((error) => {
        const { errorCode, errorMessage, email, credential } = error;
      });
  }


  render() {
    const { formName, email, password } = this.state;
    return (
      <div className="authPage" >
        <Card className="authForm" >
          <form className="authForm" onSubmit={this.handleSubmit} name={this.name}>
            <TextField
              name="email"
              floatingLabelText="Email"
              onChange={this.handleChange}
              value={email}
            />
            <TextField
              name="password"
              floatingLabelText="Password"
              type="password"
              onChange={this.handleChange}
              value={password}
            />
            <RaisedButton primary id="submitButton" label={formName} type="submit" />
            {this.state.error && this.state.error.response && <div>{this.state.error.response.data}</div>}
          </form>
        </Card>
        <Card
          className="OAuth"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            margin: '15px',
            height: '400px',
            width: '25px',
          }}
        >
          <RaisedButton
            label="Login with Google"
            style={{
              margin: '30px',
              width: '200px',
            }}
            icon={<FontIcon className="muidocs-icon-custom-github" />}
            backgroundColor="#0D47A1"
            labelColor="#ffffff"
            className="OAuth-button"
            onClick={this.signInWithGoogle}
          />
          <br />
          <RaisedButton
            label="Login with GitHub"
            style={{
              margin: '30px',
              width: '200px',
            }}
            icon={<FontIcon className="muidocs-icon-custom-github" />}
            backgroundColor="#EF6C00"
            labelColor="#ffffff"
            className="OAuth-button"
            onClick={this.signInWithGithub}
          />
        </Card>
      </div>
    );
  }
}

export const Login = AuthForm;
export const Signup = AuthForm;

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
