import db from '../../firebase/initFirebase';

// create a snippet
export const createSnippet = (
  text,
  language,
  doc, // foreign key for the document that includes this snippet
  authors, // user or users who have authored this snippet: { user1: true, user5: true, ... }
  authorGroups = null, // any groups authors tie to snippet: { group2: true, group10: true, ... }
) => {
  return db.collection('snippets').add({
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

// find a single snippet

// find all snippets for a particular user

// find all snippets for a particular document

// update a snippet

// delete a snippet
