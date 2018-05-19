import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Delete from 'material-ui/svg-icons/action/delete';
import {
  markSnippetAsRunning,
  markSnippetAsDormant,
  deleteSnippet,
} from '../crud/snippet';
import {
  runAllSnippetsInNotebook,
  pauseAllSnippetsInNotebook,
  removeNotebookSnippet,
  deleteNotebook,
} from '../crud/notebook';


/*
This helper component declares an interface to start ("play") executing code, stop
("pause") executing code, and delete code. The three functions are detailed below:

// play
// if snippet: set snippet to running
// if notebook: set all snippets in notebook to running (and can there be shared scope?)

// pause
// if snippet: set snippet to !running
// if notebook: set all snippets in notebook to !running

// delete
// if snippet: delete snippet, remove from notebook
// if notebook: remove notebook, redirect to allNotebooks page for this user
*/


const PlayPauseDeleteBtns = ({ scope, notebookId, snippetId }) => (
  <div className="footer-right">
    <FloatingActionButton className="footer-play-btn">
      <PlayArrow
        onClick={(evt) => {
          evt.preventDefault();
          if (scope === 'snippet') return markSnippetAsRunning(snippetId);
          else return runAllSnippetsInNotebook(notebookId);
        }}
      />
    </FloatingActionButton>

    {/*
    <FloatingActionButton className="footer-pause-btn">
      <Pause
        onClick={(evt) => {
          evt.preventDefault();
          if (scope === 'snippet') return markSnippetAsDormant(snippetId);
          else return pauseAllSnippetsInNotebook(notebookId);
        }}
      />
    </FloatingActionButton>
      */}

    <FloatingActionButton className="footer-delete-btn">
      <Delete
        onClick={(evt) => {
          evt.preventDefault();
          if (scope === 'snippet') {
            return Promise.all([
              deleteSnippet(snippetId),
              removeNotebookSnippet(notebookId, snippetId),
            ]);
          } else return deleteNotebook(notebookId);
        }}
      />
    </FloatingActionButton>
  </div>
);

export default PlayPauseDeleteBtns;
