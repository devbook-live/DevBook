import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';

// fetchUserFunction

export default class NotebookMetadata extends Component {
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
    return (
      <div className="single-notebook-metadata-container">
      <div className="single-notebook-contributors">
        <h2>Contributors</h2>
        {
          this.props.users.map((userId) => {
            if (userId in this.props.clients) {
              return <p className="notebook-active-contributor">{userId}</p>;
            }
            return <p className="notebook-inactive-contributor">{userId}</p>;
          })
        }
      </div>
      <div className="single-notebook-groups">
        <h2>Groups</h2>
        {
          this.props.groups.map((groupId) => {
            return <p className="notebook-group">{groupId}</p>;
          })
        }
      </div>
    </div>
    );
  }
}
