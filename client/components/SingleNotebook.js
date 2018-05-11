import React, { Component } from 'react';
import {
  notebookById,
  notebookUsers, notebookGroups, notebookSnippets, notebookClients,
  addClient, removeClient, removeAllClients,
} from '../crud/notebook';
import { auth } from '../../firebase/initFirebase';
import { CodeSnippet, CodeOutput, NotebookFooter } from '../components';


// id of this notebook = this.props.match.params.id
// note that if this component renders, the notebook will always have already been "created" in our db.

export default class SingleNotebook extends Component {
  constructor() {
    super();
    this.state = {
      users: { '2HrJnNSzOebAy2XihlU944ZpWts2': true }, // [auth.currentUser], --for now dummy data
      groups: { },
      snippets: { },
    };
  }

  componentDidMount() {
    let loadedNotebook;
    notebookById(this.props.match.params.notebookId)
      .then((notebook) => {
        loadedNotebook = notebook;
        return addClient(notebook.id, '2HrJnNSzOebAy2XihlU944ZpWts2');
        // vs. auth.currentUser (should use), or auth().currentUser, or this.props.isLoggedIn
      })
      .then(() => {
        loadedNotebook = loadedNotebook.data();
        this.setState({
          users: loadedNotebook.users,
          groups: loadedNotebook.groups,
          snippets: loadedNotebook.snippets,
        });
      });
  }

  componentWillUnmount() {
    removeAllClients(this.props.match.params.id);
  }

  render() {
    return (
      <div>

        <div className="single-notebook-metadata-container">
          <div className="single-notebook-contributors">
          contributors
          </div>
          <div className="single-notebook-groups">
          groups
          </div>
        </div>

        {
          Object.keys(this.state.snippets).map(snippetId => (
            <div className="single-notebook-code-container">
              <CodeSnippet snippet={snippetId} />
              <CodeOutput visible={false} /> {/* should be based on checking snippetRunningStatus */}
            </div>
          ))
        }

        <NotebookFooter notebookId={this.props.match.params.id} />

      </div>
    );
  }
}
