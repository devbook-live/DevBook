import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Delete from 'material-ui/svg-icons/action/delete';
import { createSnippet } from '../crud/snippet';
import { notebookGroups } from '../crud/notebook';
import { auth } from '../../firebase/initFirebase';

// import AddIcon from '@material-ui/icons/Add';
// import Icon from 'material-ui/Icon';
// import DeleteIcon from '@material-ui/icons/Delete';


const style = {
  marginRight: 20,
};

// props: this.props.notebookId
class Footer extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
  }

  select = index => this.setState({ selectedIndex: index });

  render() {
    return (
      <Paper zDepth={1} className="single-notebook-sticky-footer">
        <BottomNavigation selectedIndex={this.state.selectedIndex}>

          <div className="footer-left">
            <FloatingActionButton style={style}>
              <ContentAdd
                onClick={(evt) => {
                  evt.preventDefault();
                  this.select(0);
                  createSnippet(
                    null,
                    'javascript', // for now
                    this.props.notebookId,
                    auth.currentUser,
                    notebookGroups(this.props.notebookId),
                  );
                }}
              />
            </FloatingActionButton>
          </div>

          <div className="footer-right">
            <FloatingActionButton style={style}>
              <PlayArrow
                onClick={(evt) => {
                  evt.preventDefault();
                  this.select(1);
                  // run all snippets in this notebook, in sequence.
                  console.log('running all snippets in this notebook');
                }}
              />
            </FloatingActionButton>

            <FloatingActionButton style={style}>
              <Pause
                onClick={(evt) => {
                  evt.preventDefault();
                  this.select(2);
                  // pause notebook snippets' execution
                  console.log('pausing execution for this notebook');
                }}
              />
            </FloatingActionButton>

            <FloatingActionButton style={style}>
              <Delete
                onClick={(evt) => {
                  evt.preventDefault();
                  this.select(3);
                  // run all snippets in this notebook, in sequence.
                  console.log('running all snippets in this notebook');
                }}
              />
            </FloatingActionButton>
          </div>

        </BottomNavigation>
      </Paper>
    );
  }
}

export default Footer;
