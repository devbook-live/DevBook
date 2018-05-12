import * as firebase from 'firebase';
import Remove from 'material-ui/svg-icons/content/remove';
import React, { Component } from 'react';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { PlayPauseDelete } from '../components';

class Snippet extends Component {
  constructor() {
    super();
    this.state = {
      value: 'function(){ return "Hello, world!" }',
      result: '',
      snippetVisible: true,
    };

    this.runCode = this.runCode.bind(this);
    this.saveCode = this.saveCode.bind(this);
  }

  runCode() {
    Promise.resolve(eval(this.state.value))
      .then(result => this.setState({ result }))
      .catch(err => console.error('Error running code: ', err));
  }

  saveCode() {
    const codesRef = firebase.database().ref('codes');
    codesRef.push({
      name: 'anonymous',
      text: this.state.value,
    });
  }

  toggleSnippetVisibility = (evt) => {
    evt.preventDefault();
    this.setState({ snippetVisible: !this.state.snippetVisible });
  };

  render() {
    return (
      <Card>
        <div className="snippet-header">
          <Remove onClick={this.toggleSnippetVisibility} />
        </div>
        { this.state.snippetVisible &&
          <div className="snippet-body">
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
              <PlayPauseDelete scope="snippet" />
            </CardActions>
          </div>
        }
        <h1>{this.state.result}</h1>
      </Card>
    );
  }
}


export default Snippet;
