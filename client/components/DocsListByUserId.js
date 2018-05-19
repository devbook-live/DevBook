/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subheader from 'material-ui/Subheader';
import { db } from '../../firebase/initFirebase';
import history from '../history';


class DocsListByUserId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docsInfo: [],
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    this.unsubscribe = db.collection('users').doc(userId)
      .onSnapshot((doc) => {
        this.onSnapshotCallback(doc).catch(err => console.error(err));
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSnapshotCallback(doc) {
    if (doc.data().documents) {
      const docIds = Object.keys(doc.data().documents);
      const docsInfo = (await Promise.all(docIds.map(docId => db.collection('notebooks').doc(docId).get()))).map(curDoc => curDoc.data());
      this.setState({ docsInfo });
    }
  }

  handleClick(event, docName) {
    history.push(`/notebooks/${docName}`);
  }

  render() {
    const { docsInfo } = this.state;
    console.log('docsInfo: ', docsInfo);

    return (
      <div>
        <List>
          {
            docsInfo.map(doc =>
              (<ListItem
                key={doc.name}
                primaryText={doc.name}
                onClick={event => this.handleClick(event, doc.name)}
                value={doc.name}
              />))
          }
        </List>
      </div>
    );
  }
}

export default DocsListByUserId;
