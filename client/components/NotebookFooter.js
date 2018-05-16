import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { createSnippet } from '../crud/snippet';
import { notebookGroups, addSnippet } from '../crud/notebook';
import { auth } from '../../firebase/initFirebase';
import { PlayPauseDelete } from '../components';

// props: this.props.notebookId
const Footer = ({ notebookId, users, groups }) => (
  <Paper zDepth={1}>
    <BottomNavigation className="single-notebook-footer">

      <div className="footer-left">
        <FloatingActionButton className="footer-add-btn">
          <ContentAdd
            onClick={(evt) => {
              evt.preventDefault();
              createSnippet('', 'javascript', notebookId, users, groups)
              // then, add this snippet to the current notebook
                .then(newSnippet => addSnippet(notebookId, newSnippet.id));
            }}
          />
        </FloatingActionButton>
      </div>

      <PlayPauseDelete
        scope="notebook"
        notebookId={notebookId}
      />{/* note "notebook" vs "snippet" scope */}

    </BottomNavigation>
  </Paper>
);

export default Footer;
