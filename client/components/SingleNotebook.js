/* eslint-disable max-len */

import React, { Component } from 'react';
import {
  notebookUserListener, notebookClientListener, notebookGroupListener, notebookSnippetListener, notebookById,
  notebookUsers, notebookClients, notebookGroups, notebookSnippets,
  addClient, removeAllClients,
} from '../crud/notebook';
import { auth } from '../../firebase/initFirebase';
import { CodeSnippet, NotebookMetadata, NotebookFooter } from '../components';

export default class SingleNotebook extends Component {
  constructor() {
    super();
    this.state = {
      users: [auth.currentUser.uid],
      clients: [],
      groups: [],
      snippets: {},
      listeners: [],
    };
  }

  async componentDidMount() {
    const { notebookId } = this.props.match.params;
    await addClient(notebookId, auth.currentUser.uid);
    const [users, clients, groups, snippetsSnapshot] = await Promise.all([
      notebookUsers(notebookId),
      notebookClients(notebookId),
      notebookGroups(notebookId),
      notebookSnippets(notebookId),
    ]);
    const snippets = this.orderSnippets(snippetsSnapshot);
    this.setState({ users, clients, groups, snippets });
    this.addListeners();
  }

  componentWillUnmount() {
    removeAllClients(this.props.match.params.notebookId);
    this.removeListeners(); // unsubscribe this notebook from realtime updates
  }

  addListeners = () => {
    const { notebookId } = this.props.match.params;
    this.setState({ listeners: [
      notebookUserListener(notebookId, snapshot => this.populateNotebook('users', snapshot)),
      notebookClientListener(notebookId, snapshot => this.populateNotebook('clients', snapshot)),
      notebookGroupListener(notebookId, snapshot => this.populateNotebook('groups', snapshot)),
      notebookSnippetListener(notebookId, snapshot => this.orderSnippets(snapshot)),
    ] });
  }

  removeListeners = () => {
    this.state.listeners.forEach((listener) => {
      if (listener) listener();
    });
  }

  populateNotebook = (stateField, fieldSnapshot) =>
    this.setState({
      [stateField]: fieldSnapshot.docs.filter(d => d.data().exists).map(d => d.id),
    });

  orderSnippets = (snapshot) => {
    const snippets = snapshot.docs.reduce((snippetState, nextDoc) => {
      const idx = nextDoc.id;
      const snippetId = Object.keys(nextDoc.data())[0];
      snippetState[idx] = snippetId;
      return snippetState;
    }, {});
    this.setState({ snippets });
  }

  render() {
    const { notebookId } = this.props.match.params;
    return (
      <div>
        <NotebookMetadata
          notebookId={notebookId}
          users={this.state.users}
          clients={this.state.clients}
          groups={this.state.groups}
          snippets={this.state.snippets}
        />
        <div className="single-notebook-snippets-container">
          {
            this.state.snippets && Object.keys(this.state.snippets)
              .sort((a, b) => a > b)
              .map((index) => {
                const snippetId = this.state.snippets[index];
                return (
                  <div className="single-notebook-code-container" key={snippetId}>
                    <CodeSnippet snippetId={snippetId} notebookId={notebookId} />
                  </div>
                );
              })
          }
        </div>

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
