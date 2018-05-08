import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { getGroupsByUserId, getGroupById, addGroup, updateGroup, deleteGroup } from '../crud/group';



class CreateGroup extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      users: [],
      chosenUser: {},
    };
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };

    this.handleAddUser = this.handleAddUser.bind(this);
    this.handleCreateGroup = this.handleCreateGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleAddUser() {
    this.setState({ users: [...this.state.users, this.state.chosenUser] });
  }

  handleRequestDelete(key) {
    this.users = this.state.users;
    const chipToDelete = this.users.map(user => user.id).indexOf(key);
    this.users.splice(chipToDelete, 1);
    this.setState({ users: this.users });
  }

  handleCreateGroup() {
    const name = this.state.name;
    const users = {};
    this.state.users.map(user => {
      users[user.id] = user.name;
    });
    const body = { users };

    addGroup(name, body);
  }

  handleChange(event) {
    event.preventDefault();
    const name = event.target.value;
    this.setState({ name });
  }

  renderChip(data) {
    return (
      <Chip
        key={data.id}
        onRequestDelete={() => this.handleRequestDelete(data.id)}
        style={this.styles.chip}
      >
        {data.name}
      </Chip>
    );
  }

  render() {
    const fakeUsers = [
      { id: 0, name: 'Jang' },
      { id: 1, name: 'Ben' },
      { id: 2, name: 'Connor' },
      { id: 3, name: 'Fred' },
      { id: 4, name: 'Sarah' },
      { id: 5, name: 'Omri' },
      { id: 6, name: 'Geoff' },
    ];

    const dataSourceConfig = {
      text: 'name',
      value: 'id',
    };

    return (
      <div>
        <TextField
          id="group-name"
          floatingLabelText="Group Name"
          onChange={this.handleChange}
        /><br />

        <div style={this.styles.wrapper}>
          {this.state.users.map(this.renderChip, this)}
        </div>
        <AutoComplete
          floatingLabelText="User Name"
          filter={AutoComplete.fuzzyFilter}
          dataSource={fakeUsers}
          dataSourceConfig={dataSourceConfig}
          maxSearchResults={5}
          onNewRequest={user => this.setState({ chosenUser: user })}
        />
        <RaisedButton
          label="ADD"
          primary
          onClick={this.handleAddUser}
        /><br />

        <br />
        <RaisedButton
          label="CREATE GROUP"
          primary
          onClick={this.handleCreateGroup}
        />
      </div>
    );
  }
}

export default CreateGroup;
