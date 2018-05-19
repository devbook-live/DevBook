/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import { UsersListByNotebookId } from './';
import {cyan500, pink200, indigo900} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import { db } from '../../firebase/initFirebase';
import { auth } from '../../firebase/initFirebase';



export default class NotebookMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersInfo: [],
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
  }

  componentDidMount() {
    const { notebookId } = this.props;
    this.unsubscribe = db.collection('notebooks').doc(notebookId)
      .onSnapshot((doc) => {
        this.onSnapshotCallback(doc).catch(err => console.error(err));
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSnapshotCallback(doc) {
    if (doc.data().users) {
      const userIds = Object.keys(doc.data().users);
      const usersInfo = (await Promise.all(userIds.map(userId => db.collection('users').doc(userId).get()))).map(curUser => curUser.data());
      this.setState({ usersInfo });
    }
  }



//   constructor() {
//     super();
//     this.state = {
//       userName: '',
//       users: [],
//       chosenUser: {},
//       groupName: '',
//       groups: [],
//       chosenGroup: {},
//     };
//     this.styles = {
//       chip: {
//         margin: 4,
//       },
//       wrapper: {
//         display: 'flex',
//         flexWrap: 'wrap',
//       },
//     };
//   }

//   handleAdd = (type = 'user') => {
//     const ids = [];
//     this.state[type].forEach(entity => ids.push(entity.id));
//     if (ids.includes(this.state[`chosen${type}`].id)) {
//       alert(`${this.state[`chosen${type}`].name} is already selected!`);
//     } else {
//       this.setState({ [`${type}s`]: [...this.state[`${type}s`], this.state[`chosen${type}`]] });
//     }
//     this.refs.autocomplete.setState({ searchText: '' });
//   }

//   handleRequestDelete = (type = 'user', key) => {
//     const entities = this.state[`${type}s`];
//     const chipToDelete = entities.map(entity => entity.id).indexOf(key);
//     entities.splice(chipToDelete, 1);
//     this.setState({ [`${type}s`]: entities });
//   }

//   handleCreateGroup (event, type = 'user') {
//     event.preventDefault();
//     const name = this.state[`${type}Name`];
//     const body = this.state[`${type}s`].reduce((bodyObj, entity) => {
//       bodyObj[entity.id] = entity.name;
//       return bodyObj;
//     }, {});
//     addGroup(name, { [`${type}s`]: body });
//   }

//   handleChange(event, type = '') {
//     event.preventDefault();
//     const name = event.target.value;
//     this.setState({ name });
//   }

//   renderChip(data) {
//     return (
//       <Chip
//         key={data.id}
//         onRequestDelete={() => this.handleRequestDelete(data.id)}
//         style={this.styles.chip}
//       >
//         {data.name}
//       </Chip>
//     );
//   }


// }

  render() {
    const { usersInfo } = this.state;
    return (
      <div className="single-notebook-metadata-container">
        <div className="single-notebook-contributors">
          <h3>Contributors</h3>
          <div style={this.styles.wrapper}>
            {usersInfo.map((user) => {
              if (user.id === auth.currentUser.uid) {
                return (
                  <Chip
                    backgroundColor={pink200}
                    style={this.styles.chip}
                  >
                  me
                  </Chip>
                )
              }

              else {
                return (
                  <div>
                    <Chip
                      backgroundColor={cyan500}
                      style={this.styles.chip}
                    >
                    {/* <Avatar size={32} color={blue300} backgroundColor={indigo900}>
                      MB
                    </Avatar> */}
                    {user.displayName}
                    </Chip>
                  </div>
                )
              }

            })}
          </div>
        </div>
        <div className="single-notebook-groups">
          {/* <h2>Groups</h2>
          {
            this.props.groups.map((groupId) => {
              return <p className="notebook-group">{groupId}</p>;
            })
          } */}
        </div>
      </div>
    );
  }
}
