/* eslint-disable new-cap */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { createNotebook } from '../crud/notebook';

const { auth } = require('../../firebase/initFirebase');

export default class CreateNotebook extends Component {
  constructor() {
    super();
    this.state = { notebookId: '' };
  }

  componentDidMount() {
    const { currentUser } = auth;
    const createNotebookPromise =
      currentUser ? createNotebook({ currentUser }) : createNotebook({ null: true });

    console.log('creating promise');
    createNotebookPromise
      .then((docRef) => { console.log('notebook id: ', docRef.id); this.setState({ notebookId: docRef.id }); });
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
