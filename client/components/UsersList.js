import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subheader from 'material-ui/Subheader';
import db from '../../firebase/initFirebase';


class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersInfo: [],
    };
  }

  componentDidMount() {
    this.gatherUsers()
      .then(usersInfo => this.setState({ usersInfo }));
  }

  async gatherUsers() {
    const { groupId } = this.props;
    const doc = await db.collection('groups').doc(groupId).get();
    const userIds = Object.keys(doc.data().users);
    const users = await Promise.all(userIds.map(userId => db.collection('users').doc(userId).get()));
    const usersInfo = users.map(user => user.data());

    return usersInfo;
  }

  render() {
    const { usersInfo } = this.state;
    return (
      <div>
        <List>
          <Subheader>Users</Subheader>
          {
            usersInfo.map(user => <ListItem primaryText={user.name} />)
          }
        </List>
      </div>
    );
  }
}

export default UsersList;
