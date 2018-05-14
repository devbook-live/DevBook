/* eslint-disable max-len */

import React, { Component } from 'react';
import {
  notebookUserListener, notebookClientListener, notebookGroupListener, notebookSnippetListener, notebookById,
  notebookUsers, notebookClients, notebookGroups, notebookSnippets,
  addClient, removeClient, removeAllClients,
} from '../crud/notebook';
import { auth } from '../../firebase/initFirebase';
import { CodeSnippet, CodeOutput, NotebookMetadata, NotebookFooter } from '../components';


// id of this notebook = this.props.match.params.id
// note that if this component renders, the notebook will always have already been "created" in our db.


export default class SingleNotebook extends Component {
  constructor() {
    super();
    this.state = {
      users: ['2HrJnNSzOebAy2XihlU944ZpWts2'], // [auth.currentUser], --for now dummy data
      clients: [],
      groups: [],
      snippets: [],
      listeners: {
        users: null,
        clients: null,
        groups: null,
        snippets: null,
      },
    };
  }

  componentDidMount() {
    const { notebookId } = this.props.match.params;
    addClient(notebookId, '2HrJnNSzOebAy2XihlU944ZpWts2') // vs. auth.currentUser (should use), or auth().currentUser, or this.props.isLoggedIn
      .then(() => {
        return Promise.all([
          notebookUsers(notebookId),
          notebookClients(notebookId),
          notebookGroups(notebookId),
          notebookSnippets(notebookId),
        ]);
      })
      .then(([users, clients, groups, snippets]) => {
        this.setState({ users, clients, groups, snippets });
        this.addListeners();
      });
  }


  //   let loadedNotebook;

  //   // should be a listener
  //   // this.state.listener = notebookSnippetListener(this.props.match.params.notebookId, this.populateNotebook);
  //   // console.log('LISTENER: ', this.state.listener);

  //   notebookSnippets(this.props.match.params.notebookId);

  //   notebookById(this.props.match.params.notebookId)
  //     .then((notebook) => {
  //       loadedNotebook = notebook;
  //       return addClient(notebook.id, '2HrJnNSzOebAy2XihlU944ZpWts2');
  //       // vs. auth.currentUser (should use), or auth().currentUser, or this.props.isLoggedIn
  //     })
  //     .then(() => {
  //       loadedNotebook = loadedNotebook.data();
  //       console.log('LOADED NOTEBOOK DATA: ', loadedNotebook);
  //       this.setState({
  //         users: loadedNotebook.users,
  //         clients: Object.assign({}, loadedNotebook.clients, { '2HrJnNSzOebAy2XihlU944ZpWts2': true }),
  //         groups: loadedNotebook.groups,
  //         snippets: loadedNotebook.snippets,
  //       });
  //     });
  // }

  componentWillUnmount() {
    removeAllClients(this.props.match.params.notebookId);
    this.removeListeners(); // unsubscribe this notebook from realtime updates
  }

  addListeners = () => {
    const { notebookId } = this.props.match.params;
    this.setState({
      listeners: {
        users: notebookUserListener(notebookId, snapshot => this.populateNotebook('users', snapshot)),
        clients: notebookClientListener(notebookId, snapshot => this.populateNotebook('clients', snapshot)),
        groups: notebookGroupListener(notebookId, snapshot => this.populateNotebook('groups', snapshot)),
        snippets: notebookSnippetListener(notebookId, snapshot => this.populateNotebook('snippets', snapshot)),
      },
    });
  }

  removeListeners = () => {
    Object.values(this.state.listeners).forEach(listener => listener());
  }

  populateNotebook = (stateField, fieldSnapshot) =>
    this.setState({
      [stateField]: fieldSnapshot.docs.filter(d => d.data().exists).map(d => d.id),
    });

  render() {
    return (
      <div>
        <NotebookMetadata
          notebookId={this.props.match.params.notebookId}
          users={this.state.users}
          clients={this.state.clients}
          groups={this.state.groups}
          snippets={this.state.snippets}
        />
        {
          Object.keys(this.state.snippets).map(snippetId => (
            <div className="single-notebook-code-container" key={snippetId}>
              <CodeSnippet snippet={snippetId} />
              <CodeOutput visible={false} />
            </div>
          ))
        }

        <NotebookFooter
          notebookId={this.props.match.params.notebookId}
          users={this.state.users}
          clients={this.state.clients}
          groups={this.state.groups}
          snippets={this.state.snippets}
        />

      </div>
    );
  }
}
