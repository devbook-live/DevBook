/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { DocsListByUserId, GroupsListByUserId } from './';
import { fetchUserFunction } from '../crud/user';
import { db } from '../../firebase/initFirebase';

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      userId: this.props.match.params.userId,
      value: '',
    };
  }

  componentDidMount() {
    const { userId } = this.props.match.params;
    this.unsubscribe = db.collection('users').doc(userId)
      .onSnapshot((doc) => {
        this.setState({ userInfo: doc.data() });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    const { userId } = this.state;
    const { userInfo } = this.state;
    console.log('INFOOOO: ', userInfo);

    return (
      <div>
        <div className="userPage">
          <div className="userPic">
            <CardMedia className="userPic">
              <img src="https://i0.wp.com/www.thisblogrules.com/wp-content/uploads/2010/02/batman-for-facebook.jpg?resize=250%2C280" alt="" />
            </CardMedia>
            <CardTitle
              title={userInfo.displayName || userInfo.name || userInfo.email}
              subtitle='About me:'
            />
            <CardText>
              { userInfo.aboutMe || 'Update profile with a short bio!'}
            </CardText>
            <CardActions>
              <FlatButton
                label="Edit Profile"
                backgroundColor="#a4c639"
                hoverColor="#8AA62F"
                style={{
                  marginRight: '15px',
                  width: '150.25px',
                }}
              />
              <FlatButton
                label="Delete Profile"
                backgroundColor="red"
                hoverColor="#bf0000"
                style={{
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

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
