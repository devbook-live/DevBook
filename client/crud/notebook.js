/* eslint-disable max-len */

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

import { db } from '../../firebase/initFirebase';
import { createEntity, entityById, entityByField, entityByIdListener, allEntities,
  updateEntityField,
  addDocToSubcollection, removeDocFromSubcollection, getDocsInSubcollection,
  deleteEntity, garbageCollectEntityField } from './utils';
import { markSnippetAsRunning, markSnippetAsDormant } from './snippet';

// Create ops:
const createNotebook = (users, groups = {}, snippets = {}) =>
  createEntity('notebooks', { users, groups, snippets });

// Read ops:
const notebookById = id => entityById('notebooks', id);

const notebookUserListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/users').onSnapshot(callback);
const notebookClientListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/clients').onSnapshot(callback);
const notebookGroupListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/groups').onSnapshot(callback);
const notebookSnippetListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/snippets').onSnapshot(callback);

  // .then(({ docs }) => docs.filter(d => d.data().exists).map(d => d.id));
  // db.collection(collectionName)
  //   .get();
  //   db.collection(collectionName).doc(entityId).onSnapshot(callback);

// deprecated:
const notebookListener = (id, callback) => entityByIdListener('notebooks', id, callback);


const clientsByDoc = (docId) => {
  entityById('notebooks', docId)
    .then(doc => doc.clients)
    .catch(err => `Trouble fetching clients for this doc: ${err}`);
};
const docsByUser = userId => entityByField('notebooks', 'users', userId, true);
const docsByGroup = groupId => entityByField('notebooks', 'groups', groupId, true);
const docsBySnippet = snippetId => entityByField('notebooks', 'snippets', snippetId, true);
const allDocs = () => allEntities('notebooks');

// const notebookUsers = notebookId => entityByField('users', 'notebooks', notebookId, true);
// const notebookGroups = notebookId => entityByField('groups', 'notebooks', notebookId, true);
// const notebookSnippets = notebookId => entityByField('snippets', 'notebooks', notebookId, true);
// const notebookClients = notebookId => entityByField('clients', 'notebooks', notebookId, true);

const notebookUsers = notebookId => getDocsInSubcollection('notebooks', notebookId, 'users');
const notebookGroups = notebookId => getDocsInSubcollection('notebooks', notebookId, 'groups');
const notebookSnippets = notebookId => getDocsInSubcollection('notebooks', notebookId, 'snippets');
const notebookClients = notebookId => getDocsInSubcollection('notebooks', notebookId, 'clients');


// Update ops: (these target single notebooks)
// note "client" means "client currently looking at this document":
// also the "true" arg refers to the fact that this field is a nested object.


const addClient = (docId, clientId) =>
  addDocToSubcollection('notebooks', docId, 'clients', clientId);
const addAuthor = (docId, userId) =>
  addDocToSubcollection('notebooks', docId, 'users', userId);
const addGroup = (docId, groupId) =>
  addDocToSubcollection('notebooks', docId, 'groups', groupId);
const addSnippet = (docId, snippetId) =>
  addDocToSubcollection('notebooks', docId, 'snippets', snippetId);
// the addl "false" arg refers to the fact that want to remove (rather than add) this entry.
const removeClient = (docId, clientId) =>
  removeDocFromSubcollection('notebooks', docId, 'clients', clientId);

const removeAllClients = notebookId =>
  db.collection('notebooks')
    .doc(notebookId)
    .set({ clients: {} }, { merge: true });
const removeDocAuthor = (docId, userId) =>
  updateEntityField('notebooks', docId, 'users', userId, true, false);
const removeDocGroup = (docId, groupId) =>
  updateEntityField('notebooks', docId, 'groups', groupId, true, false);
const removeNotebookSnippet = (docId, snippetId) =>
  removeDocFromSubcollection('notebooks', docId, 'snippets', snippetId);

const toggleAllSnippetsInNotebook = (notebookId, status) =>
  notebookSnippets(notebookId)
    .then((snippetIds) => {
      const runSnippets = status === 'running'
        ? snippetIds.map(id => markSnippetAsRunning(id))
        : snippetIds.map(id => markSnippetAsDormant(id));
      return Promise.all(runSnippets);
    });
const runAllSnippetsInNotebook = id => toggleAllSnippetsInNotebook(id, 'running');
const pauseAllSnippetsInNotebook = id => toggleAllSnippetsInNotebook(id, 'dormant');

// Delete ops:
const deleteNotebook = id => deleteEntity('notebooks', id);

module.exports = {
  createNotebook,

  notebookById,

  notebookUserListener,
  notebookClientListener,
  notebookGroupListener,
  notebookSnippetListener,
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
  addAuthor,
  addGroup,
  addSnippet,
  removeClient,
  removeAllClients,
  removeDocAuthor,
  removeDocGroup,
  removeNotebookSnippet,
  runAllSnippetsInNotebook,
  pauseAllSnippetsInNotebook,

  deleteNotebook,
};
