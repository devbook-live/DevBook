import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { getGroupsByUserId, getGroupById, addGroup, updateGroup, deleteGroup } from '../crud/group';
import { Card } from 'material-ui/Card';
import UsersList from './UsersList';
import DocsList from './DocsList';

class SingleGroup extends Component {
  render() {
    const { groupId } = this.props.match.params;
    return (
      <div className="singleGroupPage">
        <Card className="usersList">
          <UsersList groupId={groupId}/>
        </Card>
        <Card className="docsList">
          <DocsList groupId={groupId}/>
        </Card>
      </div>
    )
  }
}

export default SingleGroup;
