import db from '../../firebase/initFirebase';

const groupsRef = db.collection('groups');

const getGroupsByUserId = (userId) => {
  groupsRef.where(`users.${userId}`, "==", true)
    .get()
    .then(querySnapshot => {
      return querySnapshot.data();
    })
    .catch(err => {
      console.log('Error getting documents: ', err);
    });
};

const getGroupById = (groupId) => {
  groupsRef.where("id", "==", groupId)
    .get()
    .then(querySnapshot => {
      return querySnapshot.data();
    })
    .catch(err => {
      console.log('Error getting documents: ', err);
    });
};

const addGroup = (id, name, snippets, users, documents) => {
  groupsRef.doc(name).set({
    id,
    name,
    snippets,
    users,
    documents,
  })
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((err) => {
      console.log('Error writing document: ', err);
    });
};

const updateGroup = (id, name, snippets, users, documents) => {
  return groupsRef.doc(name).set({
    id,
    name,
    snippets,
    users,
    documents,
  })
    .then(() => {
      console.log('Document successfully updated!');
    })
    .catch((err) => {
      console.log('Error updating document: ', err);
    });
};

const deleteGroup = (id) => {
  groupsRef.doc(id).delete()
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
