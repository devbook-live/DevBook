import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subheader from 'material-ui/Subheader';
import { db } from '../../firebase/initFirebase';


class DocsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docsInfo: [],
    };
  }

  componentDidMount() {
    const { groupId } = this.props;
    this.unsubscribe = db.collection('groups').doc(groupId)
      .onSnapshot((doc) => {
        this.onSnapshotCallback(doc).catch(err => console.error(err));
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSnapshotCallback(doc) {
    const docIds = Object.keys(doc.data().documents);
    const docsInfo = (await Promise.all(docIds.map(docId => db.collection('documents').doc(docId).get()))).map(curDoc => curDoc.data());
    this.setState({ docsInfo });
  }

  render() {
    const { docsInfo } = this.state;

    return (
      <div>
        <List>
          <Subheader>Documents</Subheader>
          {
            docsInfo.map(doc => <ListItem key={doc.id} primaryText={doc.name} />)
          }
        </List>
      </div>
    );
  }
}

export default DocsList;
