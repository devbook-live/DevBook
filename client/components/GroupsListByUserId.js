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


class GroupsListByUserId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsInfo: [],
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    this.unsubscribe = db.collection('users').doc(userId)
      .onSnapshot((doc) => {
        this.onSnapshotCallback(doc).catch(err => console.error(err));
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSnapshotCallback(doc) {
    if (doc.data().groups) {
      const groupIds = Object.keys(doc.data().groups);
      const groupsInfo = (await Promise.all(groupIds.map(groupId => db.collection('groups').doc(groupId).get()))).map(curGroup => curGroup.data());
      this.setState({ groupsInfo });
    }
  }

  render() {
    const { groupsInfo } = this.state;

    return (
      <div>
        <List>
          {
            groupsInfo.map(group => <ListItem key={group.id} primaryText={group.name} />)
          }
        </List>
      </div>
    );
  }
}

export default GroupsListByUserId;
