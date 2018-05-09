import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subheader from 'material-ui/Subheader';
import db from '../../firebase/initFirebase';


class DocsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docsInfo: [],
    };
  }

  componentDidMount() {
    this.gatherDocs()
      .then(docsInfo => this.setState({ docsInfo }));
  }

  async gatherDocs() {
    const { groupId } = this.props;
    const doc = await db.collection('groups').doc(groupId).get();
    const docIds = Object.keys(doc.data().documents);
    const docs = await Promise.all(docIds.map(docId => db.collection('documents').doc(docId).get()));
    const docsInfo = docs.map(doc2 => doc2.data());

    return docsInfo;
  }

  render() {
    const { docsInfo } = this.state;

    return (
      <div>
        <List>
          <Subheader>Documents</Subheader>
          {
            docsInfo.map(doc => <ListItem primaryText={doc.name} />)
          }
        </List>
      </div>
    );
  }
}

export default DocsList;
