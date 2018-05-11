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
const createEntity = (collectionName, collectionFieldsObj) =>
  db.collection(collectionName)
    .add(collectionFieldsObj);

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

// Update ops:
const updateEntityField = (collectionName, entityId, field, value, isObjField = false, addEntry = true) => {
  const condition = isObjField
    ? { [[field][value]]: addEntry }
    : { [field]: value };
  return db.collection(collectionName)
    .doc(entityId)
    .update(condition);
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
  entityByField,
  allEntities,
  // U
  updateEntityField,
  // D
  deleteEntity,
  garbageCollectEntityField,
};
