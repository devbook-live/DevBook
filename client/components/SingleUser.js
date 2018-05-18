/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { DocsListByUserId, GroupsListByUserId } from './';
import { fetchUserFunction } from '../crud/user';

// firebase imports
import { db, auth } from '../../firebase/initFirebase';

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        created: this.creationHelper(auth.currentUser.metadata.creationTime),
      },
      userId: this.props.match.params.userId,
      value: '',
    };
  }

  componentDidMount() {
    db.collection('users').doc(auth.currentUser.uid).get()
      .then((user) => {
        const state = { aboutMe: user.data().aboutMe };
        this.setState(state);
      })
      .catch(err => console.error(err));
  }

  render() {
    const { userId, userInfo, aboutMe } = this.state;
    const user = auth.currentUser;
    return (
      <div>
        <div className="userPage">
          <div className="userPic">
            <CardMedia className="userPic">
              <img
                src={
                user.photoURL
                ? user.photoURL
                : 'https://i0.wp.com/www.thisblogrules.com/wp-content/uploads/2010/02/batman-for-facebook.jpg?resize=250%2C280'}
                alt=""
              />
            </CardMedia>
            <CardTitle
              title={userInfo.displayName}
              subtitle="About me:"
            />
            <CardText>
              {`Joined ${userInfo.created}`}
            </CardText>
            <CardText>
              { aboutMe || 'Update profile with a short bio!'}
            </CardText>
            <CardActions>
              <Link to={`/users/${userId}/edit`} >
                <FlatButton
                  label="Edit Profile"
                  backgroundColor="#a4c639"
                  hoverColor="#8AA62F"
                  style={{
                    color: 'white',
                    marginRight: '15px',
                    width: '150.25px',
                  }}
                />
              </Link>
              <FlatButton
                label="Delete Profile"
                backgroundColor="red"
                hoverColor="#bf0000"
                style={{
                  color: 'white',
                  width: '150.25px',
                }}
              />
            </CardActions>
          </div>
          <div className="userInfo">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
            >
              <Tab label="Groups" value="a">
                <div>
                  <GroupsListByUserId userId={userId} />
                  <FloatingActionButton mini secondary>
                    <ContentAdd />
                  </FloatingActionButton>
                </div>
              </Tab>
              <Tab label="Notebooks" value="b">
                <div>
                  <DocsListByUserId userId={userId} />
                  <FloatingActionButton mini secondary>
                    <ContentAdd />
                  </FloatingActionButton>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default SingleUser;

SingleUser.prototype.deleteUser = () => {
  const user = auth.currentUser;

  user.delete().then(() => {
    // need to redirect to Login
  }).catch((error) => {
    console.error(error);
  });
};

SingleUser.prototype.creationHelper = (str) => {
  return str.slice(0, -13);
};

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
