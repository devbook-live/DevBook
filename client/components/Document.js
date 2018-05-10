import React, { Component } from 'react';
import * as firebase from 'firebase';
import runCode from '../codeRunFlow';
import { addDocClient, removeDocClient } from '../crud/document';
import Snippet from './Snippet';

export default class Document extends Component {
  constructor() {
    super();
    this.state = {
      id: 'testDoc', // something like 'this.props.match.params.id'
    };
  }
  componentDidMount() {
    const clientId = 'testClient'; // get current user's id from firestore
    addDocClient(this.state.id, clientId);
  }
  componentWillUnmount() {
    const clientId = 'testClient'; // get current user's id from firestore
    removeDocClient(this.state.id, clientId);
  }
  render() {
   return (

   );
  }
}


// doc will also need to check if *any* child snippets are currently running. probs add an fb listener :
// https://firebase.google.com/docs/firestore/query-data/listen
// the thing is, now, what if I only want to snapshot something *very* specific, i.e. if there is any snippet currently wanting to be "run". perhaps put them in a queue? or run all at once?
