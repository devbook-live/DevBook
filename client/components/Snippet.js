/* eslint-disable react/no-unused-state */

import * as firebase from 'firebase';
import Remove from 'material-ui/svg-icons/content/remove';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { PlayPauseDelete, CodeOutput } from '../components';
import { db } from '../../firebase/initFirebase';
import { snippetListener, snippetOutputListener, updateSnippetText, snippetById } from '../crud/snippet';

/* props passed down from SingleNotebook:
 - `snippetId`: the id for this snippet
 - `notebookId`: the id for this snippet's currently viewable notebook
*/

/* ----- STYLES ----- */
const snippetStyle = {
  margin: '0px 100px 0px 100px',
};


class Snippet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      output: '', // Docker client output, via firestore "snippetOutputs" collection
      snippetVisible: true,
      running: false,
    };
    this.id = props.snippetId;
    this.listeners = [];
  }

  componentDidMount() {
    // this.listeners.push(snippetListener(this.id, this.setText));
    // this.listeners.push(snippetListener(this.id, this.setRunning));
    this.listeners.push(snippetOutputListener(this.id, this.setOutput));
    snippetById(this.id)
      .then((data) => {
        const { text } = data.data();
        console.log('text: ', text);
        if (text) this.setState({ text });
      });
  }

  componentWillUnmount() {
    this.listeners.forEach(unsubscribeListener => unsubscribeListener());
  }

  setStateFieldFromSnapshot = (snapshot, field) => {
    const data = snapshot.data();
    if (data && data[field]) {
      console.log("==================================")
      console.log("STATE BEFORE:", this.state);
      console.log("field:", field);
      console.log("data", data);
      console.log("data[field]", data[field] )
      this.setState({ [field]: data[field] });
      console.log("STATE AFTER:", this.state);
      console.log("==================================")

    }
  }
  // setText = snippetSnapshot => this.setStateFieldFromSnapshot(snippetSnapshot, 'text');
  // setRunning = snippetSnapshot => this.setStateFieldFromSnapshot(snippetSnapshot, 'running');
  setOutput = snippetSnapshot => this.setStateFieldFromSnapshot(snippetSnapshot, 'output');

  toggleSnippetVisibility = (evt) => {
    evt.preventDefault();
    this.setState({ snippetVisible: !this.state.snippetVisible });
  };

  render() {
    const { snippetId, notebookId } = this.props;
    return (
      <Card style={snippetStyle}>
        <div className="snippet-header">
          <Remove onClick={this.toggleSnippetVisibility} />
        </div>
        { this.state.snippetVisible &&
          <div className="snippet-body">
            <CodeMirror
              className="snippet-code-body"
              value={this.state.text}
              options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, text) => {
                this.setState({ text });
              }}
              onChange={(editor, data, text) => {
                updateSnippetText(this.id, text);
                // In case you need to know what these params include:
                // console.log('state changed: ', text);
                // console.log('editor: ', editor);
                // console.log('data: ', data);
              }}
            />
            <CardActions>
              <PlayPauseDelete
                scope="snippet"
                notebookId={notebookId}
                snippetId={snippetId}
              />
            </CardActions>
          </div>
        }
        {
          this.state.output &&
          <CodeOutput output={this.state.output} />
        }
      </Card>
    );
  }
}

export default Snippet;
