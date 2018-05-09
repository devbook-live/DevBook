import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
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
    const groupId = this.props.groupId;
    let gatherUsers = [];
    const usersId = db.collection("groups").doc(groupId).get()
    .then(doc => doc.data().users)
    .then(users => Object.keys(users))
    .then(usersId => {
      return Promise.all(usersId.map(userId => {
        return db.collection("users").doc(userId).get()
          .then(user => gatherUsers.push(user.data()))
      }))
    })
    .then(() => this.setState({ usersInfo: gatherUsers }));
  }

  render() {
    const usersInfo = this.state.usersInfo;
    return (
      <div>
        <List>
          <Subheader>Users</Subheader>
          {
            usersInfo.map(user => {
              return (
                <ListItem primaryText={user.name}/>
              )
            })
          }
        </List>
      </div>
    )
  }
};

export default UsersList;
