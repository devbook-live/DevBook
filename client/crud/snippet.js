/* eslint-disable max-len */

/*
CRUD for Snippets

// Create ops:
createSnippet
// Read ops:
snippetById
snippetsByUser
snippetsByGroup
snippetsByDoc
snippetsByLang
allSnippets
snippetOutputListener
checkSnippetRunningStatus
// Update ops:
updateSnippetText
updateSnippetLang
addSnippetAuthor
removeSnippetAuthor
addSnippetGroup
removeSnippetGroup
addSnippetDoc
removeSnippetDoc
// Delete ops:
deleteSnippet
*/

import { db } from '../../firebase/initFirebase';

// create a snippet
const createSnippet = (
  input,
  language,
  doc, // foreign key for the document that includes this snippet
  authors, // user or users who have authored this snippet: { user1: true, user5: true, ... }
  authorGroups = null, // any groups authors tie to snippet: { group2: true, group10: true, ... }
) =>
  db.collection('snippets')
    .add({
      input,
      language,
      notebook: doc,
      users: authors,
      groups: authorGroups,
      running: false,
      output: null,
    });

// find a single snippet (by id)
const snippetById = (id) => {
  return db.collection('snippets')
    .doc(id)
    .get()
    .then((snippet) => {
      if (snippet.exists) {
        console.log('Snippet data:', snippet.data());
        return snippet;
      }
      // else, snippet.data() will be undefined
      console.log('No such snippet exists.');
      return null;
    })
    .catch((error) => {
      console.log('Error getting snippet:', error);
    });
};

// "snippets by field" helper function:
const snippetsByField = (fieldName, fieldId) => {
  return db.collection('snippets')
    .where(fieldName + '.' + fieldId, '==', true)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
      });
      return querySnapshot;
    })
    .catch((error) => {
      console.log('Error getting snippets:', error);
    });
};

// find all snippets for a particular user
const snippetsByUser = userId => snippetsByField('users', userId);

// find all snippets for a particular group
const snippetsByGroup = groupId => snippetsByField('groups', groupId);

// find all snippets for a particular document
const snippetsByDoc = docId => snippetsByField('documents', docId);

// find all snippets for a particular language
const snippetsByLang = (language) => {
  return db.collection('snippets')
    .where('language', '==', language)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
      });
      return querySnapshot;
    })
    .catch((error) => {
      console.log('Error getting snippets:', error);
    });
};

// find all snippets ever
const allSnippets = () => {
  return db.collection('snippets')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
      });
      return querySnapshot;
    })
    .catch((error) => {
      console.log('Error getting snippets:', error);
    });
};

const snippetOutputListener = (snippetId) => {
  return db.collection('snippets')
    .doc(snippetId)
    .onSnapshot(doc => doc.data().output); // output will be null, or...an obj?
};

// "update snippet" helper function:
const updateSnippet = (snippetId, fieldToUpdate, updatedValue) => {
  const snippetRef = db.collection('snippets').doc(snippetId);
  return db.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(snippetRef).then((snippet) => {
      if (!snippet.exists) throw new ReferenceError('Snippet does not exist.');
      return transaction.update(snippetRef, { [fieldToUpdate]: updatedValue });
    });
  })
    .then((transactionRecord) => {
      console.log('Transaction successfully committed!', transactionRecord);
      return transactionRecord;
    })
    .catch(error => console.log('Transaction failed: ', error));
};

// update snippet text
const updateSnippetText = (id, text) => updateSnippet(id, 'text', text);

// update snippet language
const updateSnippetLang = (id, lang) => updateSnippet(id, 'language', lang);

// "update snippet object field" helper functions (for users, groups, and documents objs):
// these cover the "associations" between our nested objects.

// nested objs are represented in fire(base/store) in the following "join table"-like way:
//   { id_0: true, ..., id_n: true }

// both return *new* field objects
const fieldObjAdd = (snippet, fieldToUpdate, valueToUpdate) => {
  const newFieldObj = Object.assign(
    {},
    snippet.data()[fieldToUpdate],
    { [valueToUpdate]: true },
  );
  return newFieldObj;
};
const fieldObjRemove = (snippet, fieldToUpdate, valueToUpdate) => {
  const newFieldObj = Object.assign(
    {},
    snippet.data()[fieldToUpdate],
  );
  delete newFieldObj[valueToUpdate];
  return newFieldObj;
};

const updateSnippetObjectFieldCallback = (
  snippet,
  fieldToUpdate,
  valueToUpdate,
  actionType,
) => {
  // returns a newFieldObj or throws an error
  if (!snippet.exists) throw new ReferenceError('Snippet does not exist.');
  // eventually, we may want to try to locate the given user or group to make sure they exist.
  if (actionType === 'add') { // add value to fieldObj
    return fieldObjAdd(snippet, fieldToUpdate, valueToUpdate);
  } else if (actionType === 'remove') { // remove value from fieldObj
    return fieldObjRemove(snippet, fieldToUpdate, valueToUpdate);
  }
  throw new TypeError('Please specify an actionType of either "add" or "remove".');
};

// final meta helper function wrapper
const updateSnippetObjectField = (snippetId, fieldToUpdate, valueToUpdate, actionType = 'add') => {
  const snippetRef = db.collection('snippets').doc(snippetId);
  return db.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(snippetRef).then((snippet) => {
      const newFieldObj = updateSnippetObjectFieldCallback(snippet, fieldToUpdate, valueToUpdate, actionType);
      console.log('NEW FIELD OBJ:', newFieldObj);
      return transaction.update(snippetRef, { [fieldToUpdate]: newFieldObj });
    });
  })
    .then((transactionRecord) => {
      console.log('Transaction successfully committed!', transactionRecord);
      return transactionRecord;
    })
    .catch(error => console.log('Transaction failed: ', error));
};

// these are the exportable db connections available to the components:
// - users
// - groups
// - documents
// (note the current many-to-many relationship between snippets and documents, slightly different from what we had discussed but more extendable)

// add user for snippet (i.e. add an author for this snippet)
const addSnippetAuthor = (snippetId, authorId) => {
  return updateSnippetObjectField(
    snippetId,
    'users',
    authorId,
    'add',
  );
};

// remove user from snippet (i.e. remove an author for this snippet)
const removeSnippetAuthor = (snippetId, authorId) => {
  return updateSnippetObjectField(
    snippetId,
    'users',
    authorId,
    'remove',
  );
};

// add group for snippet
const addSnippetGroup = (snippetId, groupId) => {
  return updateSnippetObjectField(
    snippetId,
    'groups',
    groupId,
    'add',
  );
};

// remove group from snippet
const removeSnippetGroup = (snippetId, groupId) => {
  return updateSnippetObjectField(
    snippetId,
    'groups',
    groupId,
    'remove',
  );
};

// add document for snippet
const addSnippetDoc = (snippetId, docId) => {
  return updateSnippetObjectField(
    snippetId,
    'documents',
    docId,
    'add',
  );
};

// remove document for snippet
const removeSnippetDoc = (snippetId, docId) => {
  return updateSnippetObjectField(
    snippetId,
    'documents',
    docId,
    'remove',
  );
};

// toggle whether or not a snippet has a status of "running"
const changeSnippetRunningStatus = (snippetId, newStatus) => updateSnippet(snippetId, 'running', newStatus);
const markSnippetAsRunning = id => changeSnippetRunningStatus(id, true);
const markSnippetAsDormant = id => changeSnippetRunningStatus(id, false);

// delete a snippet
const deleteSnippet = (snippetId) => {
  db.collection('snippets')
    .doc(snippetId)
    .delete()
    .then(() => console.log('Snippet successfully deleted!'))
    .catch(error => console.error('Error removing snippet: ', error));
};

module.exports = {
  // C
  createSnippet,
  // R
  snippetById,
  snippetsByUser,
  snippetsByGroup,
  snippetsByDoc,
  snippetsByLang,
  allSnippets,
  snippetOutputListener,
  // U
  updateSnippetText,
  updateSnippetLang,
  addSnippetAuthor,
  removeSnippetAuthor,
  addSnippetGroup,
  removeSnippetGroup,
  addSnippetDoc,
  removeSnippetDoc,
  markSnippetAsRunning,
  markSnippetAsDormant,
  // D
  deleteSnippet,
};


// the above does not cover adding and removing snippet ids from their *associated* objects.
