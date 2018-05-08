/* global describe before it */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable new-cap */

// Overriding dependencies
const proxyquire = require('proxyquire').noCallThru();
// Firebase mocking
const firebasemock = require('firebase-mock');

// Creates a mock for authentication
const mockauth = new firebasemock.MockFirebase();

// Creates a mock for firestore
let mockfirestore = new firebasemock.MockFirestore();

// function MockFirebaseSdk(createDatabase, createAuth, createFirestore, createStorage, createMessaging)
// so if you specify createFirestore parameter, then in the returned object from MockFirebaseSdk,
// value for the key "firestore" will be what you passed in as createFirestore
// We aren't using this at the moment though
const mocksdk = firebasemock.MockFirebaseSdk(null, () => mockauth, () => mockfirestore);

const chai = require('chai');

const { assert } = chai;

describe('Cloud Functions', () => {
  let myFunctions;

  describe('addGroup', () => {
    before(() => {
      // create a new mock for firestore before we run stuff
      mockfirestore = new firebasemock.MockFirestore();
      // causes promises to immediately resolve
      mockfirestore.autoFlush();
      // So group.js is requiring '../../firebase/initFirebase', right?
      // What this is doing is overriding that require with our mockfirestore
      myFunctions = proxyquire('./group.js', {
        '../../firebase/initFirebase': mockfirestore,
      });
    });

    it('add a Group 5 group', (done) => {
      // same thing as db.collection('groups') in groups.js
      const groupsRef = mockfirestore.collection('groups');

      myFunctions.addGroup('Group 5', { snippets: { 1: true, 2: true }, users: { 1: true, 2: true, 3: true } })
        .then(() => {
          // getData() returns { 'Group 5': { snippets: { 1: true, 2: true }, users: { 1: true, 2: true, 3: true } } }
          const group5 = groupsRef.getData()['Group 5'];
          // So we just check that that there's a users key for 'Group 5' and then there's a '1' key for users in 'Group 5'
          assert(Object.prototype.hasOwnProperty.call(group5, 'users') && Object.prototype.hasOwnProperty.call(group5.users, '1'));
        })
        .finally(done);
    });
  });
});
