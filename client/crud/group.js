import { db } from '../../firebase/initFirebase';
import { allEntities, entityById, updateEntityField } from './utils';

const groupsRef = db.collection('groups');

// Read ops:
const allGroups = () => allEntities('groups');
const groupById = groupId => entityById('groups', groupId);

const getGroupsByUserId = (userId) => {
  return groupsRef.where(`users.${userId}`, '==', true)
    .get()
    .then((querySnapshot) => {
      // querySnapshot.forEach((doc) => {
      //   console.log(doc.id, ' => ', doc.data());
      // });
      return querySnapshot;
    })
    .catch((err) => {
      console.log('Error getting documents: ', err);
    });
};

const getGroupById = (groupId) => {
  return groupsRef.where('id', '==', groupId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
      return querySnapshot;
    })
    .catch((err) => {
      console.log('Error getting documents: ', err);
    });
};

const addGroup = (name, bodyObj) => {
  return groupsRef.doc(name).set(bodyObj);
};


const updateGroup = (name, bodyObj) => {
  return groupsRef.doc(name).set(bodyObj)
    .then(() => {
      console.log('Document successfully updated!');
    })
    .catch((err) => {
      console.log('Error updating document: ', err);
    });
};

const removeGroupMember = (groupId, userId) =>
  updateEntityField('groups', groupId, 'users', userId, true, false);

// delete doc, need to provide doc name, not doc name
const deleteGroup = (name) => {
  groupsRef.doc(name).delete()
    .then(() => {
      console.log('Document successfully deleted!');
    })
    .catch((err) => {
      console.log('Error removing document: ', err);
    });
};

module.exports = {
  groupById,
  allGroups,
  getGroupsByUserId,
  getGroupById,
  addGroup,
  updateGroup,
  removeGroupMember,
  deleteGroup,
};
