/* global describe before after it */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable new-cap */

const proxyquire = require('proxyquire').noCallThru();
const firebasemock = require('firebase-mock');

const mockauth = new firebasemock.MockFirebase();
let mockfirestore = new firebasemock.MockFirestore();
const mocksdk = firebasemock.MockFirebaseSdk(null, () => {
  return mockauth;
}, () => {
  return mockfirestore;
});
const mockapp = mocksdk.initializeApp();

const chai = require('chai');

const { assert } = chai;

describe('Cloud Functions', () => {
  let myFunctions;

  describe('addtestName', () => {
    before(() => {
      mockfirestore = new firebasemock.MockFirestore();
      mockfirestore.autoFlush();
      myFunctions = proxyquire('./group.js', {
        '../../firebase/initFirebase': mockfirestore,
      });
    });

    it('add a Group 5 group', (done) => {
      const groupsRef = mockfirestore.collection('groups');

      myFunctions.addGroup('Group 5', { snippets: { 1: true, 2: true }, users: { 1: true, 2: true, 3: true } })
        .then(() => {
          const group5 = groupsRef.getData()['Group 5'];
          assert(group5.users && group5.users[1]);
          done();
        });
    });
  });
});
