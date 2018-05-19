/* eslint-disable max-len */

/*
CRUD for Docs (**now called "notebooks"**)

// Create ops:
createDoc
// Read ops:
allNotebooks
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
const allNotebooks = () => allEntities('notebooks');
const notebookById = id => entityById('notebooks', id);

const notebookUserListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/users').onSnapshot(callback);
const notebookClientListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/clients').onSnapshot(callback);
const notebookGroupListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/groups').onSnapshot(callback);
const notebookSnippetListener = (notebookId, callback) =>
  db.collection('notebooks/' + notebookId + '/snippets').onSnapshot(callback);

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
const notebookSnippets = (notebookId) => {
  // getDocsInSubcollection('notebooks', notebookId, 'snippets')
  return db.collection('notebooks' + '/' + notebookId + '/' + 'snippets').get()
    // .then((result) => {
    //   const ordered = result.docs
    //   return ordered;
      //   .sort((a,b) => +a.id > +b.id)
      //   .map(doc => doc.data());
      // return Object.keys(ordered).reduce((snippetState, nextSnippetIdx) => {
      //     snippetState[nextSnippetIdx] = Object.keys(ordered[nextSnippetIdx])[0];
      //     return snippetState;
      //   }, {});
    };

    // const counter = +result.docs.map(doc => doc.id).sort((a,b) => a>b)[result.docs.length-1] || 0;

// };
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
// const addSnippet = (docId, snippetId) =>
//   addDocToSubcollection('notebooks', docId, 'snippets', snippetId);

const addSnippet = (notebookId, snippetId) => {
  db.collection('notebooks' + '/' + notebookId + '/' + 'snippets').get()
    .then((result) => {
      const counter = +result.docs.map(doc => doc.id).sort((a, b) => a > b)[result.docs.length - 1] || 0;
      db.doc('notebooks' + '/' + notebookId + '/' + 'snippets' + '/' + String(counter + 1)).set({ [snippetId]: true });
    });
};

// the addl "false" arg refers to the fact that want to remove (rather than add) this entry.
const removeClient = (docId, clientId) =>
  removeDocFromSubcollection('notebooks', docId, 'clients', clientId);

const removeAllClients = notebookId =>
  db.collection('notebooks')
    .doc(notebookId)
    .set({ clients: {} }, { merge: true });
const removeDocAuthor = (notebookId, userId) =>
  updateEntityField('notebooks', notebookId, 'users', userId, true, false);
const removeDocGroup = (notebookId, groupId) =>
  updateEntityField('notebooks', notebookId, 'groups', groupId, true, false);

const removeNotebookSnippet = (notebookId, snippetId) => {
  db.collection('notebooks/' + notebookId + '/snippets')
    .get()
    .then((snippets) => {
      const snippetToDelete = snippets.docs.find((doc) => {
        return Object.keys(doc.data())[0] === snippetId;
      });
      removeDocFromSubcollection('notebooks', notebookId, 'snippets', snippetToDelete.id);
    });
};

// The following are helper functions for running all snippets in a notebook. The strategy is to take a slight pause (1ms? 10?) after setting the `running` field to `true` for each snippet in a notebook, to avoid concurrency issues with actually running snippets.
// Resource on `sleep`: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms));

const oneMsSleep = sleep(1);
const tenMsSleep = sleep(10);

const toggleAllSnippetsInNotebook = async (notebookId, snippetToggleCallback) => {
  const { docs } = await notebookSnippets(notebookId);
  docs.forEach(async (doc) => {
    const snippetId = Object.keys(doc.data())[0];
    snippetToggleCallback(snippetId);
    await oneMsSleep();
  });
};

const runAllSnippetsInNotebook = id => toggleAllSnippetsInNotebook(id, markSnippetAsRunning);
const pauseAllSnippetsInNotebook = id => toggleAllSnippetsInNotebook(id, markSnippetAsDormant);

// Delete ops:
const deleteNotebook = id => deleteEntity('notebooks', id);

module.exports = {
  createNotebook,

  allNotebooks,
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
