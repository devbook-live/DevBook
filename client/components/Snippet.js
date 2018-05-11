/* eslint-disable react/no-unused-state */
/* eslint-disable no-else-return */

import React, { Component } from 'react';
import { Card, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { db } from '../../firebase/initFirebase';

class Snippet extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      notebook: '',
      language: 'javascript',
      value: 'console.log(\'Hello World!\');',
      output: '',
    };

    this.id = undefined;
    this.unsubscribe = undefined;
    this.running = false;

    this.runCode = this.runCode.bind(this);
    this.saveCode = this.saveCode.bind(this);
  }

  componentDidMount() {
    console.log('Test');
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  doSubscribe() {
    console.log(`Subscribing to ${this.id}...`);
    this.unsubscribe = db.collection('snippetOutputs').doc(this.id)
      .onSnapshot((doc) => {
        console.log('Got doc: ', doc);
        console.log('doc data: ', doc.data());

        if (doc.data()) {
          this.setState({ output: doc.data().output });
        } else {
          this.setState({ output: 'Loading...' });
        }

        db.collection('snippets').doc(this.id).set({ running: false }, { merge: true })
          .then(() => this.setState({ running: false }));
      });
  }

  async runCodeHelper() {
    if (!this.id) {
      console.log('Saving');
      await this.saveCode();
    }

    console.log('Set running to true');
    await db.collection('snippets').doc(this.id).set({ running: true }, { merge: true });
  }

  runCode() {
    this.runCodeHelper()
      .then(() => console.log('Reached before'))
      .then(() => { console.log('Reached before doSubscribe call'); this.doSubscribe(); })
      .then(() => console.log('Reached after'))
      .catch(err => console.error(`${err} : Error running snippet.`));
  }

  stopCode() {
    db.collection('snippets').doc(this.id).set({ running: false }, { merge: true })
      .catch(() => console.error('Error stopping snippet.'));
  }

  saveCode() {
    const { notebook, language, value } = this.state;
    const docBody = { notebook, language, text: value };

    if (!this.id) {
      console.log('A');
      return db.collection('snippets')
        .add(docBody)
        .then((ref) => { this.id = ref.id; });
    } else {
      console.log('B');
      return db.collection('snippets').doc(this.id)
        .set(docBody, { merge: true })
        .then(() => {});
    }
  }

  render() {
    return (
      <Card>
        <CodeMirror
          value={this.state.value}
          options={{
            mode: 'javascript',
            theme: 'material',
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({ value });
          }}
          onChange={(editor, data, value) => {
             console.log('state changed: ', value);
             console.log('editor: ', editor);
             console.log('data: ', data);
          }}
        />

        <CardActions>
          <RaisedButton
            label="Run Code"
            primary
            disabled={this.running}
            onClick={(event) => {
              event.preventDefault();
              this.runCode();
            }}
          />
          <RaisedButton
            label="Stop Code"
            primary
            disabled={!this.running}
            onClick={(event) => {
              event.preventDefault();
              this.stopCode();
            }}
          />
          <RaisedButton
            label="Save"
            primary
            onClick={(event) => {
              event.preventDefault();
              this.saveCode();
            }}
          />
        </CardActions>
        <h1>{this.state.output}</h1>
      </Card>);
  }
}

export default Snippet;
