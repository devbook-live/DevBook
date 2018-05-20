/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import history from '../history';

// import { DocsListByUserId, GroupsListByUserId } from './';
import { userById, userNotebooks, userGroups, deleteUserFunction, removeNotebook } from '../crud/user';
import { removeNotebookAuthor } from '../crud/notebook';
import { removeGroupMember } from '../crud/group';
// import { getGroupsByUserId } from '../crud/group';
// import { notebooksByUser } from '../crud/notebook';
import { AllGroups, AllNotebooks, EditProfile, CreateGroup } from './';
import { auth } from '../../firebase/initFirebase';


class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        created: this.creationHelper(auth.currentUser.metadata.creationTime),
      },
      userId: this.props.match.params.userId,
      value: '',
      notebooks: [],
      groups: [],
      showEditComponent: false,
      showCreateGroupComponent: false,
    };
  }

  componentDidMount() {
    Promise.all([
      userById(this.props.match.params.userId),
      userNotebooks(this.props.match.params.userId),
      userGroups(this.props.match.params.userId),
    ])
      .then(([user, notebooks, groups]) => {
        this.setState({
          aboutMe: user.data().aboutMe,
          notebooks,
          groups,
        });
      });
  }

  render() {
    const { userId, userInfo, aboutMe } = this.state;
    const user = this.props.match.params.userId;
    return (
      <div>
        <div className="userPage">
          <div className="userPic">
            <CardMedia className="userPic">
              <img
                src={
                user.photoURL
                ? user.photoURL
                : 'https://i0.wp.com/www.thisblogrules.com/wp-content/uploads/2010/02/batman-for-facebook.jpg?resize=250%2C280'}
                alt=""
              />
            </CardMedia>
            <CardTitle
              title={userInfo.displayName}
              subtitle="About me:"
            />
            <CardText>
              {`Joined ${userInfo.created}`}
            </CardText>
            <CardText>
              { aboutMe || 'Update profile with a short bio!'}
            </CardText>
            <CardActions>
              <FloatingActionButton>
                <Edit
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState((prevState) => {
                      return { showEditComponent: !prevState.showEditComponent };
                    });
                  }}
                />
              </FloatingActionButton>
              <FloatingActionButton>
                <Delete
                  onClick={(event) => {
                    event.preventDefault();
                    deleteUserFunction(this.state.userId);
                    history.push('/notebooks');
                  }}
                />
              </FloatingActionButton>
            </CardActions>
            { this.state.showEditComponent && <EditProfile /> }
          </div>

          <div className="userInfo">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              inkBarStyle={{
                backgroundColor: '#FFFFFF',
                opacity: '.60',
              }}
            >
              <Tab label="Groups" value="a">
                {
                  this.state.groups.length
                  ? <div>
                      <AllGroups
                        groups={this.state.groups}
                        title="Your Groups"
                      />
                      <FloatingActionButton mini primary
                        className="profile-content-add"
                        onClick={(event) => {
                          event.preventDefault();
                          history.push('/groups/new');
                        }}
                      >
                        <ContentAdd />
                      </FloatingActionButton>
                    </div>
                  : <p>Loading your groups...</p>
                }

              </Tab>
              <Tab label="Notebooks" value="b">
                {
                  this.state.notebooks.length
                  ? <div>
                      <AllNotebooks
                        notebooks={this.state.notebooks}
                        title="Your Notebooks"
                      />
                      <FloatingActionButton mini primary
                        className="profile-content-add"
                        onClick={(event) => {
                          event.preventDefault();
                          history.push('/');
                        }}
                      >
                        <ContentAdd />
                      </FloatingActionButton>
                    </div>
                  : <p>Loading your notebooks...</p>
                }
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default SingleUser;

SingleUser.prototype.deleteUser = () => {
  const user = auth.currentUser;

  user.delete().then(() => {
    // need to redirect to Login
  }).catch((error) => {
    console.error(error);
  });
};

SingleUser.prototype.creationHelper = (str) => {
  return str.slice(0, -13);
};

// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.


                                {/*label="Edit Profile"
                  backgroundColor="#a4c639"
                  hoverColor="#8AA62F"
                  style={{
                    color: 'white',
                    marginRight: '15px',
                    width: '150.25px',
                  }}*/}
                {/*label="Delete Profile"
                backgroundColor="red"
                hoverColor="#bf0000"
                style={{
                  color: 'white',
                  width: '150.25px',
                }}*/}


              //   <FloatingActionButton className="footer-play-btn">
              //   <PlayArrow
              //     onClick={(evt) => {
              //       evt.preventDefault();
              //       if (scope === 'snippet') return markSnippetAsRunning(snippetId);
              //       else return runAllSnippetsInNotebook(notebookId);
              //     }}
              //   />
              // </FloatingActionButton>
