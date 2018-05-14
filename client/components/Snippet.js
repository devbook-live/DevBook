/* eslint-disable react/no-unused-state */

import * as firebase from 'firebase';
import Remove from 'material-ui/svg-icons/content/remove';
import React, { Component } from 'react';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { PlayPauseDelete, CodeOutput } from '../components';
import { db } from '../../firebase/initFirebase';
import { snippetListener, snippetOutputListener, updateSnippetText } from '../crud/snippet';

/* props passed down from SingleNotebook:
 - `snippetId`: the id for this snippet
 - `notebookId`: the id for this snippet's currently viewable notebook
*/

class Snippet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'console.log(\'Hello World!\');',
      output: '', // Docker client output, via firestore "snippetOutputs" collection
      snippetVisible: true,
    };
    this.id = props.snippetId;
    this.listeners = [];
  }

  componentDidMount() {
    this.listeners.push(snippetListener(this.id, this.setText));
    this.listeners.push(snippetOutputListener(this.id, this.setOutput));
  }

  componentWillUnmount() {
    this.listeners.forEach(unsubscribeListener => unsubscribeListener());
  }

  setStateFieldFromSnapshot = (snapshot, field) => {
    const data = snapshot.data();
    if (data) this.setState({ [field]: data[field] });
  }
  setText = snippetSnapshot => this.setStateFieldFromSnapshot(snippetSnapshot, 'text');
  setOutput = snippetSnapshot => this.setStateFieldFromSnapshot(snippetSnapshot, 'output');

  toggleSnippetVisibility = (evt) => {
    evt.preventDefault();
    this.setState({ snippetVisible: !this.state.snippetVisible });
  };

  render() {
    const { snippetId, notebookId } = this.props;
    return (
      <Card>
        <div className="snippet-header">
          <Remove onClick={this.toggleSnippetVisibility} />
        </div>
        { this.state.snippetVisible &&
          <div className="snippet-body">
            <CodeMirror
              value={this.state.output}
              options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, output) => {
                this.setState({ output });
              }}
              onChange={(editor, data, output) => {
                updateSnippetText(this.id, output);
                // In case you need to know what these params include:
                // console.log('state changed: ', output);
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
