/* eslint-disable max-len */

import React from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import { Link } from 'react-router-dom';

/* Inputs:
 - entities = all the entities from Firestore. A query snapshot.
 (query has been made, now pass results down as props to this component)
 - type = controlled field ('user', 'group', 'notebook', 'snippet'). String.
 - size = controlled field, to be used for styling. String.
 (alternately, this component could just take and pass around a 'styles' prop)
 - title = the title, if any, of this list. E.g. "Your Notebooks". String.
 - updatable = should there display the option to update fields for a given entity? Defaults to false. Boolean.
 - deletable = should there display the option to delete a given entity from its relative set of all entities? Defaults to false. Boolean.
*/

/* ------ STYLES ------- */
const entityCardsStyle = {
  display: 'flex',
  flexFlow: 'row wrap',
};

const entityCardStyle = {
  height: '150px',
  width: '150px',
};

const entityPictureStyle = {
  height: '130px',
  width: '130px',
  minWidth: '130px',
  margin: '10px 10px 10px 10px',
};

const entityPicOverlayStyle = {
  height: '40px',
  width: '130px',
  maxWidth: '130px',
  margin: '10px 10px 10px 10px',
};

const entityPicOverlayCardTitleWrapperStyle = {
  padding: '8px',
};

const entityPicTitleStyle = {
  fontSize: '23px',
  lineHeight: '0px',
};

const entityPicSubtitleStyle = {
  fontSize: '12px',
  lineHeight: '42px',
};
/* ------ END STYLES ------- */

const AllEntities = ({
  entities,
  type,
  size,
  title,
  updatable = false,
  deletable = false,
}) => (
  <div className={`all-${type}s-${size}`}> {/* E.g., all-users-small */}
    <div className="all-entity-list-header">
      <Subheader>{title}</Subheader>
    </div>
    <EntityCardsContainer
      type={type}
      entities={entities}
      updatable={updatable}
      deletable={deletable}
    />
  </div>
);

const EntityCardsContainer = ({ type, entities, updatable, deletable }) => (
  <div className={`${type}-cards-container`} style={entityCardsStyle}>
    {
      entities.map(entity => (
        <SingleEntityCard
          entityData={entity.data()}
          entityId={entity.id}
          key={entity.id}
          updatable={updatable}
          deletable={deletable}
        />
      ))
    }
  </div>
);

// helper obj for single entity cards:
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// (so far yet to implement ability to update or delete an entity from their card view)
const SingleEntityCard = ({ entityData, entityId, updatable, deletable }) => {
  let displayName;
  if ('displayName' in entityData) displayName = entityData.displayName; /* eslint-disable-line */
  else if ('name' in entityData) displayName = entityData.name;
  else if ('email' in entityData) displayName = entityData.email;
  else displayName = 'Anonymous Hedgehog';

  let photoURL;
  if ('photoURL' in entityData) photoURL = entityData.photoURL; /* eslint-disable-line */
  else photoURL = 'https://placekitten.com/200/300';

  let createdAt;
  if ('metadata' in entityData && 'creationTime' in entityData.metadata) {
    createdAt = entityData.metadata.creationTime;
    createdAt = months[createdAt.getMonth()] + ', ' + createdAt.getFullYear();
  } else createdAt = 'May, 2018';

  return (
    <Card>
      <CardMedia
        style={entityCardStyle}
        overlay={
          <CardTitle
            style={entityPicOverlayCardTitleWrapperStyle}
            title={
              <Link to={`/users/${entityId}`} className="entity-card-profile-link">
                {displayName}
              </Link>
            }
            titleStyle={entityPicTitleStyle}
            subtitle={`Circa ${createdAt}`}
            subtitleStyle={entityPicSubtitleStyle}
          />
        }
        overlayContentStyle={entityPicOverlayStyle}
      >
        <img
          src={photoURL}
          alt={displayName}
          style={entityPictureStyle}
        />
      </CardMedia>
    </Card>
  );
};

export default AllEntities;


/*
// A more expanded interface would include different cards for each type of related data. E.g.,

const UserCard = ({ entity, key, updatable, deletable }) => {};
const GroupCard = ({ entity, key, updatable, deletable }) => {};
const NotebookCard = ({ entity, key, updatable, deletable }) => {};
const SnippetCard = ({ entity, key, updatable, deletable }) => {};

const cardTypes = {
  user: UserCard,
  group: GroupCard,
  notebook: NotebookCard,
  snippet: SnippetCard,
};

// EntityCardsContainer could then dynamically render a Card based on type in the following way:
const Card = cardTypes[type];
entities.map(entity => (
  <Card ...
  ...etc.
*/
