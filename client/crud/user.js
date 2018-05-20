import { db } from '../../firebase/initFirebase';
import {
  entityById, allEntities, getDocsInSubcollection,
  addDocToSubcollection, removeDocFromSubcollection,
} from './utils';
import { notebookById } from './notebook';
import { groupById } from './group';

// Read ops:
export const userById = userId => entityById('users', userId);
export const allUsers = () => allEntities('users');
export const userNotebooks = userId =>
  getDocsInSubcollection('users', userId, 'notebooks')
    .then((notebookIds) => {
      return Promise.all(notebookIds.map(notebookId => notebookById(notebookId)));
    });
export const userGroups = userId =>
  getDocsInSubcollection('users', userId, 'groups')
    .then((groupIds) => {
      return Promise.all(groupIds.map(groupId => groupById(groupId)));
    });

export const userNotebookIds = userId =>
  getDocsInSubcollection('users', userId, 'notebooks');
export const userGroupIds = userId =>
  getDocsInSubcollection('users', userId, 'groups');

// Add a user to the database
export const addUserFunction = (id, userObj) => {
  db.collection('users').doc(id).set(userObj)
    .then(() => {
      console.log('User written with ID: ', id);
      return userObj;
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
};


// Update ops:
export const addNotebook = (userId, notebookId) =>
  addDocToSubcollection('users', userId, 'notebooks', notebookId);
export const addGroup = (userId, groupId) =>
  addDocToSubcollection('users', userId, 'groups', groupId);
export const removeNotebook = (userId, notebookId) =>
  removeDocFromSubcollection('users', userId, 'notebooks', notebookId);
export const removeGroup = (userId, groupId) =>
  removeDocFromSubcollection('users', userId, 'groups', groupId);

// Add a logged-in users data in the database
export const updateUserFunction = (id, userObj) => {
  const user = db.collection('users').doc(id);
  user.update(userObj)
    .then((docRef) => {
      console.log('User Updated. . . ');
      return docRef;
    })
    .catch((error) => {
      console.error('Error updating document: ', error);
    });
};

// delete a user from the database
export const deleteUserFunction = (loggedInUserId) => {
  const user = db.collection('users').doc(loggedInUserId);
  user.delete()
    .then(() => {
      console.log('User successfully deleted');
    })
    .catch((error) => {
      console.error('Error deleting user: ', error);
    });
};

// Get a users data
export const fetchUserFunction = (id) => {
  db.collection('users').doc(id)
    .get()
    .then((user) => {
      console.log(user.data());
      return user.data();
    })
    .catch((error) => {
      console.error(error);
    });
};

// fetch all users
export const fetchAllUsersFunction = () => {
  db.collection('users')
    .get()
    .then((snapshot) => {
      snapshot.forEach((user) => {
        console.log(user.data());
      });
    })
    .catch((error) => {
      console.error(error);
    });
};
