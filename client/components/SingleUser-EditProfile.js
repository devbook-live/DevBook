import React, { Component } from 'react';
import history from '../history';

// material-ui imports
import { Card } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// CRUD imports
import { updateUserFunction } from '../crud/user';

// firebase imports
const { auth } = require('../../firebase/initFirebase');

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth.currentUser,
      displayName: '',
      aboutMe: '',
      photoURL: '',
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
    const { user } = this.state;
    const displayName = evt.target.displayName.value;
    const aboutMe = evt.target.aboutMe.value;
    const photoURL = evt.target.photoURL.value;

    user.updateProfile({
      displayName,
      photoURL,
    }).then(() => {
      // firebase user doesn't allow extra information so
      // we store 'aboutMe' in a user table with a ref to
      // the users id
      updateUserFunction(user.uid, { aboutMe });
    }).then(() => {
      history.push(`/users/${user.uid}`);
    }).catch(err => console.error(err));
  }

  render() {
    const { user, displayName, aboutMe, photoURL } = this.state;
    return (
      <div>
        <Card>
          <form className="authForm" onSubmit={this.handleSubmit}>
            <TextField
              name="displayName"
              floatingLabelText="Display Name"
              onChange={this.handleChange}
              value={displayName}
            />
            <TextField
              name="aboutMe"
              floatingLabelText="About me:"
              onChange={this.handleChange}
              value={aboutMe}
            />
            <TextField
              name="photoURL"
              floatingLabelText="Copy and paste Photo URL!"
              onChange={this.handleChange}
              value={photoURL}
            />
            <RaisedButton
              primary
              id="submitButton"
              label="Save Changes"
              type="submit"
            />
          </form>
        </Card>
      </div>
    );
  }
}
