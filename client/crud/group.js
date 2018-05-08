const db = require('../../firebase/initFirebase');

const groupsRef = db.collection('groups');

const getGroupsByUserId = (userId) => {
  return groupsRef.where(`users.${userId}`, '==', true)
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
  getGroupsByUserId,
  getGroupById,
  addGroup,
  updateGroup,
  deleteGroup,
};
