/* eslint-disable new-cap */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { createNotebook, addSnippet } from '../crud/notebook';
import { createSnippet } from '../crud/snippet';

const { auth } = require('../../firebase/initFirebase');

export default class CreateNotebook extends Component {
  constructor() {
    super();
    this.state = { notebookId: '' };
  }

  async componentDidMount() {
    // 1. Find a logged-in user, or create an anonymous one.
    let { currentUser } = auth;
    if (!currentUser) currentUser = await auth.signInAnonymously();
    // 2. Create a new notebook.
    const notebookId = await createNotebook({ [currentUser.uid]: true });
    // const notebookId = docRef.id;
    // 3. Create a new snippet.
    const notebookSnippet = await createSnippet(
      '', 'javascript', { [notebookId]: true }, { [currentUser.uid]: true },
    );
    // 4. Add new snippet to new notebook.
    const snippetId = notebookSnippet.id;
    await addSnippet(notebookId, snippetId);
    // 5. Finally, update state to make this component redirect to the new notebook.
    this.setState({ notebookId });
  }

  render() {
    const { notebookId } = this.state;
    return (
      <div>
        {notebookId ? <Redirect to={`notebooks/${notebookId}`} /> : <h1>Loading...</h1>};
      </div>
    );
  }
}
