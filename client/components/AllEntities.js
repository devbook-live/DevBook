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
  <div className={`all-${type}s-${size} all-entities`}> {/* E.g., all-users-small */}
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


// helper obj for single entity cards:
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const DefaultEntityCard = ({ type, entityData, entityId, updatable, deletable }) => {
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
    createdAt = `Circa ${months[createdAt.getMonth()]} ${createdAt.getDay()}, '${createdAt.getFullYear()}`;
  } else createdAt = 'Circa May 6, 2018';

  return (
    <Card>
      <CardMedia
        style={entityCardStyle}
        overlay={
          <CardTitle
            style={entityPicOverlayCardTitleWrapperStyle}
            title={
              <Link to={`/${type}s/${entityId}`} className="entity-card-profile-link">
                {displayName}
              </Link>
            }
            titleStyle={entityPicTitleStyle}
            subtitle={createdAt}
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

const NotebookCard = ({ type, entityData, entityId, updatable, deletable }) => {
  const displayName = entityId;

  let photoURL;
  if ('photoURL' in entityData) photoURL = entityData.photoURL; /* eslint-disable-line */
  else photoURL = '/js-cube.png';

  let createdAt;
  if ('metadata' in entityData && 'creationTime' in entityData.metadata) {
    createdAt = entityData.metadata.creationTime;
    createdAt = `Created ${months[createdAt.getMonth()]} ${createdAt.getDay()}, '${createdAt.getFullYear()}`;
  } else createdAt = 'Created May 6, 2018';

  /*
  let updatedAt;
  if ('metadata' in entityData && 'lastUpdated' in entityData.metadata) {
    updatedAt = entityData.metadata.lastUpdated;
    updatedAt = `Last used ${createdAt.getMonth() + 1}/${createdAt.getDay()}/${String(createdAt.getFullYear()).slice(2)}`;
  } else updatedAt = 'Last used 5/6/18';
  */

  return (
    <Card>
      <CardMedia
        style={entityCardStyle}
        overlay={
          <CardTitle
            style={entityPicOverlayCardTitleWrapperStyle}
            title={
              <Link to={`/${type}s/${entityId}`} className="entity-card-profile-link">
                {displayName}
              </Link>
            }
            titleStyle={entityPicTitleStyle}
            subtitle={createdAt}
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

// const SnippetCard = ({ entity, key, updatable, deletable }) => {};

const cardTypes = {
  user: DefaultEntityCard,
  group: DefaultEntityCard,
  notebook: NotebookCard,
  // snippet: SnippetCard,
};

const EntityCardsContainer = ({ type, entities, updatable, deletable }) => {
  const EntityCard = cardTypes[type];
  return (
    <div className={`${type}-cards-container entity-cards-container`} style={entityCardsStyle}>
      {
        entities.map(entity => (
          <EntityCard
            type={type}
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
};

export default AllEntities;
