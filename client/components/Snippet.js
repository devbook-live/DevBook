import React, { Component } from 'react';
import { Card, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Controlled as CodeMirror } from 'react-codemirror2';
import * as firebase from 'firebase';

class Snippet extends Component {
  constructor() {
    super();
    this.state = {
      value: 'function(){ return "Hello, world!" }',
      result: '',
    };

    this.runCode = this.runCode.bind(this);
    this.saveCode = this.saveCode.bind(this);
  }

  runCode() {
    //promise.resolve can't catch this error if there is one.
    //Bluebird.try
    /*or new Promise((resolve, reject) => {
      try {
        eval(this.state.value)
        resolve()
      }
      catch {
        reject()
      }
    })*/
    Promise.resolve(eval(this.state.value))
      .then(result => this.setState({ result }))
      .catch(err => console.error('Error running code: ', err));
  }

  saveCode() {
    //be aware of firebase versus firestore
    const codesRef = firebase.database().ref('codes');
    codesRef.push({
      name: 'anonymous',
      text: this.state.value,
    });
  }

  render() {
    return (
      <Card>
        {/* <CardText>
          Firepad goes here.
        </CardText>
        <div id="firepad-container"></div> */}

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
            onClick={(event) => {
              event.preventDefault();
              this.runCode();
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
        <h1>{this.state.result}</h1>
      </Card>
    );
  }
}


export default Snippet;
