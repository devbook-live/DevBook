/* eslint-disable new-cap */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { createNotebook, addSnippet } from '../crud/notebook';
import { createSnippet } from '../crud/snippet';
import { addNotebook } from '../crud/user';

const { auth } = require('../../firebase/initFirebase');

export default class CreateNotebook extends Component {
  constructor() {
    super();
    this.state = { notebookId: '' };
  }

  componentDidMount() {
    this.authStateChanged = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // 2. Create a new notebook.
        const notebookId = await createNotebook({ [currentUser.uid]: true });
        // 3. Create a new snippet.
        const notebookSnippet = await createSnippet(
          '', 'javascript', { [notebookId]: true }, { [currentUser.uid]: true },
        );
        // 4. Add new snippet to new notebook, and add notebook to user's notebooks.
        const snippetId = notebookSnippet.id;
        await Promise.all([
          addSnippet(notebookId, snippetId),
          addNotebook(currentUser.uid, notebookId),
        ]);
        // 5. Finally, update state to make this component redirect to the new notebook.
        this.setState({ notebookId });
      }
    });
  }

  componentWillUnmount() {
    this.authStateChanged();
  }

  render() {
    const { notebookId } = this.state;
    return (
      <div>
        {notebookId && auth.currentUser ? <Redirect to={`notebooks/${notebookId}`} /> : <h1>Loading...</h1>};
      </div>
    );
  }
}
