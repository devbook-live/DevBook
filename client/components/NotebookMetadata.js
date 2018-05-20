/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
<<<<<<< HEAD
import {cyan500, pink200, indigo900} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
=======
import { cyan500, pink200, indigo900 } from 'material-ui/styles/colors';
>>>>>>> master
import Avatar from 'material-ui/Avatar';
import { UsersListByNotebookId } from './';
import { db, auth } from '../../firebase/initFirebase';


export default class NotebookMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersInfo: [],
    };
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
  }

  componentDidMount() {
    const { notebookId } = this.props;
    this.unsubscribe = db.collection('notebooks').doc(notebookId)
      .onSnapshot((doc) => {
        this.onSnapshotCallback(doc).catch(err => console.error(err));
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async onSnapshotCallback(doc) {
    if (doc.data().users) {
      const userIds = Object.keys(doc.data().users);
      const usersInfo = (await Promise.all(userIds.map(userId => db.collection('users').doc(userId).get()))).map(curUser => curUser.data());
      this.setState({ usersInfo });
    }
  }

  render() {
    const { usersInfo } = this.state;
    return (
      <div>
        <h3 style={{ marginTop: '10px', marginBottom: '3px' }}>Contributors:</h3>
        <div style={this.styles.wrapper} >
          {usersInfo.map((user) => {
            if (user.id === auth.currentUser.uid) {
              return (
                <Chip
                  backgroundColor={pink200}
                  style={this.styles.chip}
                >
                me
                </Chip>
              )
            }

            else {
              return (
                <div>
                  <Chip
                    backgroundColor={cyan500}
                    style={this.styles.chip}
                  >
                  {/* <Avatar size={32} color={blue300} backgroundColor={indigo900}>
                    MB
                  </Avatar> */}
                  {user.displayName}
                  </Chip>
<<<<<<< HEAD
                </div>
              )
            }

          })}
        </div>
        <Divider />
=======
                );
              } else {
                return (
                  <div>
                    <Chip
                      backgroundColor={cyan500}
                      style={this.styles.chip}
                    >
                      {user.displayName}
                    </Chip>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className="single-notebook-groups" />
>>>>>>> master
      </div>
    );
  }
}
