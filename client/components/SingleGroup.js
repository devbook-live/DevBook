import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { getGroupsByUserId, getGroupById, addGroup, updateGroup, deleteGroup, groupNotebooks, groupUsers } from '../crud/group';
import { Card } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import UsersList from './UsersList';
import DocsList from './DocsList';
import { AllUsers, AllNotebooks } from './';

class SingleGroup extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      notebooks: [],
    };
  }

  componentDidMount() {
    Promise.all([
      groupNotebooks(this.props.match.params.groupId),
      groupUsers(this.props.match.params.groupId),
    ])
      .then(([notebooks, users]) => {
        this.setState({ notebooks, users });
      });
  }

  render() {
    return (
      <div className="groupPage">
      <Paper
        zDepth={1}
        className="group-title"
      >
        <h1>{this.props.match.params.groupId}</h1>
      </Paper>
      {
        this.state.users.length && this.state.notebooks.length
        ? <div className="singleGroupPage">
            <Paper
              zDepth={1}
              className="group-members"
            >
              <AllUsers
                users={this.state.users}
                title="Group Members"
              />
            </Paper>
            <Paper
              zDepth={1}
              className="group-notebooks"
            >
              <AllNotebooks
                notebooks={this.state.notebooks}
                title="Group Notebooks"
              />
            </Paper>
          </div>
        : <p>Loading your group info...</p>
      }
      </div>
    );
  }
}

export default SingleGroup;


// <Card className="usersList">
//           <UsersList groupId={groupId}/>
//         </Card>
//         <Card className="docsList">
//           <DocsList groupId={groupId}/>
//         </Card>
