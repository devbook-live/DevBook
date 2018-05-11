/*
CRUD for Docs

// Create ops:
createDoc
// Read ops:
docById
docsByUser
docsByGroup
docsBySnippet
allDocs
// Update ops:
addDocClient // note this is a client *currently looking at* this doc
addDocAuthor
addDocGroup
addDocSnippet
removeDocClient
removeDocAuthor
removeDocGroup
removeDocSnippet
// Delete ops:
deleteDoc
/// (What would this do to associated snippets? Remove all of them, probably. Which would mean we would need to update users and groups accordingly for *both* doc and its snippets. Some sort of "cascade" method.)
*/

import { db } from '../../firebase/initFirebase';
import { createEntity, entityById, entityByField, allEntities,
  updateEntityField, deleteEntity, garbageCollectEntityField } from './utils';

// Create ops:
const createDoc = (users, groups = {}, snippets = {}) =>
  createEntity('documents', { users, groups, snippets });

// Read ops:
const docById = id => entityById('documents', id);
const clientsByDoc = (docId) => {
  entityById('documents', docId)
    .then(doc => doc.clients)
    .catch(err => `Trouble fetching clients for this doc: ${err}`);
};
const docsByUser = userId => entityByField('documents', 'users', userId, true);
const docsByGroup = groupId => entityByField('documents', 'groups', groupId, true);
const docsBySnippet = snippetId => entityByField('documents', 'snippets', snippetId, true);
const allDocs = () => allEntities('documents');


// Update ops: (these target single documents)
// note "client" means "client currently looking at this document":
// also the "true" arg refers to the fact that this field is a nested object.
const addDocClient = (docId, clientId) =>
  updateEntityField('documents', docId, 'clients', clientId, true);
const addDocAuthor = (docId, userId) =>
  updateEntityField('documents', docId, 'users', userId, true);
const addDocGroup = (docId, groupId) =>
  updateEntityField('documents', docId, 'groups', groupId, true);
const addDocSnippet = (docId, snippetId) =>
  updateEntityField('documents', docId, 'snippets', snippetId, true);

// the addl "false" arg refers to the fact that want to remove (rather than add) this entry.
const removeDocClient = (docId, clientId) =>
  updateEntityField('documents', docId, 'clients', clientId, true, false);
const removeDocAuthor = (docId, userId) =>
  updateEntityField('documents', docId, 'users', userId, true, false);
const removeDocGroup = (docId, groupId) =>
  updateEntityField('documents', docId, 'groups', groupId, true, false);
const removeDocSnippet = (docId, snippetId) =>
  updateEntityField('documents', docId, 'snippets', snippetId, true, false);

// Delete ops:
const deleteDoc = id => deleteEntity('documents', id);

module.exports = {
  createDoc,

  docById,
  clientsByDoc,
  docsByUser,
  docsByGroup,
  docsBySnippet,
  allDocs,

  addDocClient,
  addDocAuthor,
  addDocGroup,
  addDocSnippet,
  removeDocClient,
  removeDocAuthor,
  removeDocGroup,
  removeDocSnippet,

  deleteDoc,
};
