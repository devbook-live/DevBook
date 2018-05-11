/*
CRUD for Docs (**now called "notebooks"**)

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

import db from '../../firebase/initFirebase';
import { createEntity, entityById, entityByField, allEntities,
  updateEntityField, deleteEntity, garbageCollectEntityField } from './utils';

// Create ops:
const createNotebook = (users, groups = {}, snippets = {}) =>
  createEntity('notebooks', { users, groups, snippets });

// Read ops:
const notebookById = id => entityById('notebooks', id);
const clientsByDoc = (docId) => {
  entityById('notebooks', docId)
    .then(doc => doc.clients)
    .catch(err => `Trouble fetching clients for this doc: ${err}`);
};
const docsByUser = userId => entityByField('notebooks', 'users', userId, true);
const docsByGroup = groupId => entityByField('notebooks', 'groups', groupId, true);
const docsBySnippet = snippetId => entityByField('notebooks', 'snippets', snippetId, true);
const allDocs = () => allEntities('notebooks');

const notebookUsers = notebookId => entityByField('users', 'notebooks', notebookId, true);
const notebookGroups = notebookId => entityByField('groups', 'notebooks', notebookId, true);
const notebookSnippets = notebookId => entityByField('snippets', 'notebooks', notebookId, true);
const notebookClients = notebookId => entityByField('clients', 'notebooks', notebookId, true);

// Update ops: (these target single notebooks)
// note "client" means "client currently looking at this document":
// also the "true" arg refers to the fact that this field is a nested object.
const addClient = (docId, clientId) =>
  updateEntityField('notebooks', docId, 'clients', clientId, true);
const addDocAuthor = (docId, userId) =>
  updateEntityField('notebooks', docId, 'users', userId, true);
const addDocGroup = (docId, groupId) =>
  updateEntityField('notebooks', docId, 'groups', groupId, true);
const addDocSnippet = (docId, snippetId) =>
  updateEntityField('notebooks', docId, 'snippets', snippetId, true);

// the addl "false" arg refers to the fact that want to remove (rather than add) this entry.
const removeClient = (docId, clientId) =>
  updateEntityField('notebooks', docId, 'clients', clientId, true, false);
const removeAllClients = notebookId =>
  db.collection('notebooks')
    .doc(notebookId)
    .set({ clients: {} }, { merge: true });
const removeDocAuthor = (docId, userId) =>
  updateEntityField('notebooks', docId, 'users', userId, true, false);
const removeDocGroup = (docId, groupId) =>
  updateEntityField('notebooks', docId, 'groups', groupId, true, false);
const removeDocSnippet = (docId, snippetId) =>
  updateEntityField('notebooks', docId, 'snippets', snippetId, true, false);

// Delete ops:
const deleteDoc = id => deleteEntity('notebooks', id);

module.exports = {
  createNotebook,

  notebookById,
  clientsByDoc,
  docsByUser,
  docsByGroup,
  docsBySnippet,
  allDocs,

  notebookUsers,
  notebookGroups,
  notebookSnippets,
  notebookClients,

  addClient,
  addDocAuthor,
  addDocGroup,
  addDocSnippet,
  removeClient,
  removeAllClients,
  removeDocAuthor,
  removeDocGroup,
  removeDocSnippet,

  deleteDoc,
};
