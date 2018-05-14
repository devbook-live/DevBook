import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Delete from 'material-ui/svg-icons/action/delete';

const PlayPauseDeleteBtns = (props) => (
  <React.Fragment>
    <FloatingActionButton>
      <PlayArrow
        onClick={(evt) => {
          evt.preventDefault();
          console.log(props);
          // run all snippets in this notebook, in sequence.
          console.log('running all snippets in this notebook');
        }}
      />
    </FloatingActionButton>

    <FloatingActionButton>
      <Pause
        onClick={(evt) => {
          evt.preventDefault();
          // pause notebook snippets' execution
          console.log('pausing execution for this notebook');
        }}
      />
    </FloatingActionButton>

    <FloatingActionButton>
      <Delete
        onClick={(evt) => {
          evt.preventDefault();
          console.log('deleting this notebook');
        }}
      />
    </FloatingActionButton>
  </React.Fragment>
);

export default PlayPauseDeleteBtns;
