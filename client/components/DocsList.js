import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
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
    const groupId = this.props.groupId;
    let gatherDocs = [];
    const docsId = db.collection("groups").doc(groupId).get()
    .then(doc => doc.data().documents)
    .then(documents => Object.keys(documents))
    .then(docsId => {
      return Promise.all(docsId.map(docId => {
        return db.collection("documents").doc(docId).get()
          .then(doc => gatherDocs.push(doc.data()))
      }))
    })
    .then(() => this.setState({ docsInfo: gatherDocs }));
  }

  render() {
    const docsInfo = this.state.docsInfo;
    return (
      <div>
        <List>
          <Subheader>Documents</Subheader>
          {
            docsInfo.map(doc => {
              return (
                <ListItem primaryText={doc.name}/>
              )
            })
          }
        </List>
      </div>
    )
  }
};

export default DocsList;
