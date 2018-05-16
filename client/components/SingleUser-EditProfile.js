import React, { Component } from 'react';

// material-ui imports
import { Card } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// CRUD imports
import { updateUserFunction } from '../crud/user';

// firebase imports
const { db, auth } = require('../../firebase/initFirebase');

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const user = auth.currentUser;
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
    }).catch(err => console.error(err));
  }

  render() {
    const { displayName, aboutMe, photoURL } = this.state;
    console.log(this.state);
    console.log('CURRENNNTTTT USERRRR: ', auth.currentUser);
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
            <RaisedButton primary id="submitButton" label="Save Changes" type="submit" />
          </form>
        </Card>
      </div>
    );
  }
}
