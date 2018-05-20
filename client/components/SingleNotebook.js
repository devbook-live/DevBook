/* eslint-disable max-len */

import React, { Component } from 'react';
import {
  notebookUserListener, notebookClientListener, notebookGroupListener, notebookSnippetListener, notebookById,
  notebookUsers, notebookClients, notebookGroups, notebookSnippets,
  addAuthor, addClient, removeAllClients,
} from '../crud/notebook';
import { auth } from '../../firebase/initFirebase';
import { CodeSnippet, NotebookMetadata, NotebookFooter } from '../components';

export default class SingleNotebook extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      clients: [],
      groups: [],
      snippets: {},
      listeners: [],
    };
  }

  async componentDidMount() {
    this.authListener();
    const { notebookId } = this.props.match.params;
    const [users, clients, groups, snippetsSnapshot] = await Promise.all([
      notebookUsers(notebookId),
      notebookClients(notebookId),
      notebookGroups(notebookId),
      notebookSnippets(notebookId),
    ]);
    const snippets = this.orderSnippets(snippetsSnapshot);
    this.setState({ users, clients, groups, snippets });
    this.addContentListeners();
  }

  componentWillUnmount() {
    removeAllClients(this.props.match.params.notebookId);
    this.removeContentListeners(); // unsubscribe this notebook from realtime updates
    this.removeAuthListener();
  }

  authListener = () => {
    const { notebookId } = this.props.match.params;
    this.removeAuthListener = auth.onAuthStateChanged(async (user) => {
      if (user) {
        return Promise.all([
          addAuthor(notebookId, user.uid),
          addClient(notebookId, user.uid),
        ]);
      } else return null;
    });
  }

  addContentListeners = () => {
    const { notebookId } = this.props.match.params;
    this.setState({ listeners: [
      notebookUserListener(notebookId, snapshot => this.populateNotebook('users', snapshot)),
      notebookClientListener(notebookId, snapshot => this.populateNotebook('clients', snapshot)),
      notebookGroupListener(notebookId, snapshot => this.populateNotebook('groups', snapshot)),
      notebookSnippetListener(notebookId, snapshot => this.orderSnippets(snapshot)),
    ] });
  }

  removeContentListeners = () => {
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
    if (!auth.currentUser || !this.state.users.includes(auth.currentUser.uid)) return <p>Loading...</p>;
    return (
      <div className="single-notebook">


        <div className="single-notebook-fix">

          <h2 style={{marginTop: '5px', marginBottom: '5px'}}>{ notebookId }</h2>

          <NotebookMetadata
            notebookId={notebookId}
            users={this.state.users}
            clients={this.state.clients}
            groups={this.state.groups}
            snippets={this.state.snippets}
          />

          <NotebookFooter
            notebookId={this.props.match.params.notebookId}
            users={this.state.users}
            clients={this.state.clients}
            groups={this.state.groups}
            snippets={this.state.snippets}
          />
        </div>

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
      </div>
    );
  }
}
