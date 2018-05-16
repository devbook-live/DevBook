import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subheader from 'material-ui/Subheader';
import { db } from '../../firebase/initFirebase';


class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersInfo: [],
    };
  }

  /*
  componentDidMount() {
    this.gatherUsers()
      .then(usersInfo => this.setState({ usersInfo }));
  }

  async gatherUsers() {
    const { groupId } = this.props;
    const doc = await db.collection('groups').doc(groupId).get();
    const userIds = Object.keys(doc.data().users);
    const usersInfo = users.map(user => user.data());

    return usersInfo;
  }
  */

  componentDidMount() {
    const { groupId } = this.props;
    this.unsubscribe = db.collection('groups').doc(groupId)
      .onSnapshot((doc) => {
        this.onSnapshotCallback(doc).catch(err => console.error(err));
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSnapshotCallback(doc) {
    const userIds = Object.keys(doc.data().users);
    const usersInfo = (await Promise.all(userIds.map(userId => db.collection('users').doc(userId).get()))).map(user => user.data());
    this.setState({ usersInfo });
  }

  render() {
    const { usersInfo } = this.state;
    console.log('USERSSSSS INFO: ', usersInfo);
    return (
      <div>
        <List>
          <Subheader>Users</Subheader>
          {
            usersInfo[0] && usersInfo.map((user) => {
              return (<ListItem
                key={user.id}
                primaryText={user.displayName || user.name || user.email}
              />);
            })
          }
        </List>
      </div>
    );
  }
}

export default UsersList;
