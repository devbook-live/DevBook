/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */

/*
CRUD Utils

  // Create ops
  createEntity

  // Read ops:
  entityById
  entityByField
  allEntities

  // Update ops:
  updateEntityField

  // Delete ops:
  deleteEntity
  garbageCollectEntityField
*/

import { db } from '../../firebase/initFirebase';

// Create ops:
// returns the created entity (or error)
//
// So this is what the params can look like
// collectionName: notebooks
// collectionFieldsObj: { users: { null : true }, groups: {}, snippets: {} }
//
// So it creates a new document in the collection with collection name
// it gets back a document
// Now we map on the keys of collectionFieldsObj
// this would be users in the example
// and then we map on the keys in that subobject ("null" in this case)
// if the suboject is not empty (otherwise we just add a document to create subcollection)
// and so we get an array of arrays of promises
// and then we use reduce to flatten the array to get an array of promises
// then we use promise.all to carry out the operations
// and then we return the document reference

/* For a notebook, `collectionFieldsObj`s should be arranged in the following way:
users, groups = {
  vnuBBVbvybEycvFy: { exists: true },
  dnyBKCEBjahvrvju: { exists: true },
}
snippets = {
  1: { vhUbrfbFYEubiITuberi: true },
  2: { dsybfuIBEvafCGsfnhjs: true },
}
*/

const createEntity = (collectionName, collectionFieldsObj) => {
  let _docRef;
  return db.collection(collectionName).add({}) // initializing notebooks collection, in case it didn't already exist.
    .then((docRef) => {
      _docRef = docRef;
      return Object.keys(collectionFieldsObj)
      // for a notebook, this means:
      // users, groups, and snippets objs.
        .map((subcollection) => { // e.g. "snippets"
          const subcollectionPromiseAry = Object.keys(collectionFieldsObj[subcollection]).length > 0
            ? Object.keys(collectionFieldsObj[subcollection])
              .map(subDocId => db.collection(collectionName).doc(docRef.id).collection(subcollection).doc(subDocId)
                .set({ exists: true }))
            : [];
            // : [db.collection(collectionName).doc(docRef.id).collection(subcollection).add({ exists: false })];
          return subcollectionPromiseAry;
        })
        .reduce((prev, curr) => prev.concat(curr), []);
    })
    .then(promises => Promise.all(promises))
    .then(() => _docRef);
};

// Read ops:
const entityById = (collectionName, entityId) => {
  const entityName = collectionName.slice(0, collectionName.length - 1);
  return db.collection(collectionName)
    .doc(entityId)
    .get()
    .then((entity) => {
      if (entity.exists) return entity;
      return `No such ${entityName} exists.`;
    })
    .catch(error => `Error fetching ${entityName}: ${error}`);
};

const entityByIdListener = (collectionName, entityId, callback) =>
  db.collection(collectionName).doc(entityId).onSnapshot(callback);


// Returns a "query snapshot"; i.e., an array of documents.
// In traversing the array, you can call .data() on a given doc.
const entityByField = (collectionName, fieldName, fieldIdOrValue, isObjField = false) => {
  const condition = isObjField
    ? [fieldName + '.' + fieldIdOrValue, '==', true]
    : [fieldName, '==', fieldIdOrValue];
  return db.collection(collectionName)
    .where(...condition)
    .get();
};

// returns a query snapshot array (or error)
const allEntities = collectionName =>
  db.collection(collectionName)
    .get();


const getDocsInSubcollection = (coll, doc, subColl) =>
  db.collection(coll + '/' + doc + '/' + subColl)
    .get()
    .then(({ docs }) => docs.filter(d => d.data().exists).map(d => d.id));

// Update ops:
const addDocToSubcollection = (coll, doc, subColl, subDoc) =>
  db.doc(coll + '/' + doc + '/' + subColl + '/' + subDoc).set({ exists: true });

const removeDocFromSubcollection = (coll, doc, subColl, subDoc) =>
  db.doc(coll + '/' + doc + '/' + subColl + '/' + subDoc).delete();

// const addDocField;


// DEPRECATED
const updateEntityField = (collectionName, entityId, field, value, isObjField = false, addEntry = true) => {
  // const condition = isObjField
  //   ? { [[field][value]]: addEntry }
  //   : { [field]: value };
  // console.log('CONDITION (notebook, snippet): ', entityId, value, addEntry);
  // return db.collection(collectionName)
  //   .doc(entityId)
  //   .update(condition);
  // db.collection('coll').doc('doc').collection('subcoll').doc('subdoc')
  console.log('COLLECTION: ', db.collection(collectionName));
  return isObjField
    ? db.collection(collectionName + '/' + entityId + '/' + field)
      .add({ [value]: addEntry })
    : db.collection(collectionName).doc(entityId)
      .add({ [field]: value });

  // const condition = isObjField
  //   ? { [value]: addEntry }
  //   : { [field]: value };

  // return isObjField
  //   ? db.collecion(collectionName).doc(entityId + '/' + field)
  //     .set({ [value]: addEntry }, { merge: true })
  //   : db.collection(collectionName).doc(entityId)
  //     .set({ [field]: value }, { merge: true });


  // return db.doc([collectionName, entityId, field].join('/'))
  // .set(condition, { merge: true });
};

// Delete ops:
const deleteEntity = (collectionName, entityId) =>
  db.collection(collectionName)
    .doc(entityId)
    .delete();

// Garbage collection helper method
const filterObj = obj =>
  Object.keys(obj).reduce((newObj, entry) => {
    if (obj[entry]) newObj[entry] = obj[entry];
    return newObj;
  }, {});
// just for fields that are "join"-like objects: { user1: false, user3: true, ... }
const garbageCollectEntityField = (collectionName, entityId, field) =>
  entityById(collectionName, entityId)
    .then(entity => filterObj(entity.data()[field]))
    .then((newEntityField) => {
      db.collection(collectionName)
        .doc(entityId)
        .set({ [field]: newEntityField });
    });

module.exports = {
  // C
  createEntity,
  // R
  entityById,
  entityByIdListener,
  entityByField,
  allEntities,
  getDocsInSubcollection,
  // U
  addDocToSubcollection,
  removeDocFromSubcollection,
  updateEntityField,
  // D
  deleteEntity,
  garbageCollectEntityField,
};
