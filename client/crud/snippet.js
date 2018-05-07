import db from '../../firebase/initFirebase';

// create a snippet
const createSnippet = (
  text,
  language,
  doc, // foreign key for the document that includes this snippet
  authors, // user or users who have authored this snippet: { user1: true, user5: true, ... }
  authorGroups = null, // any groups authors tie to snippet: { group2: true, group10: true, ... }
) => {
  return db.collection('snippets')
    .add({
      text,
      language,
      document: doc,
      users: authors,
      groups: authorGroups,
    })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      return docRef;
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
};

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


// find all snippets for a particular document

// find all snippets for a particular language

// find all snippets ever (should be limited to admins only!)

// update a snippet

// delete a snippet


module.exports = {
  createSnippet,
  snippetById,
  snippetsByUser,
};
