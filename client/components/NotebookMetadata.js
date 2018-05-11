import React from 'react';

// fetchUserFunction

const NotebookMetadata = props => (
  <div className="single-notebook-metadata-container">
    <div className="single-notebook-contributors">
      {
        Object.keys(props.users).map(userId => {
          if (props.clients.hasOwnProperty(userId)) {
            <p className="active-contributor"></p>
          } else {

          }
        })
      }
    </div>
    <div className="single-notebook-groups">
    groups
    </div>
  </div>
);

export default NotebookMetadata;
