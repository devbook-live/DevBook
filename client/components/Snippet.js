import React, { Component } from 'react';
import { Card, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Controlled as CodeMirror } from 'react-codemirror2';
import * as firebase from 'firebase';
import runCode from '../codeRunFlow';
import { addDocClient } from '../crud/document';

class Snippet extends Component {
  constructor() {
    super();
    this.state = {
      code: 'function(){ return "Hello, world!" }',
      result: '',
    };
  }

  render() {
    const { code } = this.state;
    return (
      <Card>
        <CodeMirror
          code={code}
          options={{
            mode: 'javascript',
            theme: 'material',
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, code) => {
            this.setState({ code });
          }}
          onChange={(editor, data, code) => {
            console.log('state changed: ', code);
            console.log('editor: ', editor);
            console.log('data: ', data);
          }}
        />

        <CardActions>
          <RaisedButton
            label="Run Code"
            primary
            onClick={(event) => {
              event.preventDefault();
              runCode();
            }}
          />
          {/* <RaisedButton
            label="Save"
            primary
            onClick={(event) => {
              event.preventDefault();
              //this.saveCode();
            }}
          /> */}
        </CardActions>
        <h1>{this.state.result}</h1>
      </Card>
    );
  }
}


export default Snippet;
