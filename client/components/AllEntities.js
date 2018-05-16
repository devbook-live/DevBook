/* eslint-disable max-len */

import React from 'react';

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
      <h1>{title}</h1>
    </div>
    <EntityCardsContainer
      type={type}
      entities={entities}
      updatable={updatable}
      deletable={deletable}
    />
  </div>
);


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

const EntityCardsContainer = ({ type, entities, updatable, deletable }) => {
  const Card = cardTypes[type];
  return (
    <div className={`${type}-cards-container`}>
      {
        entities.map(entity => (
          <Card
            entity={entity}
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
