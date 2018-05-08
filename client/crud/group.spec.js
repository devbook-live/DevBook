/* global describe before after it */
/* eslint-disable global-require */
/* eslint-disable max-len */

const chai = require('chai');

const { assert } = chai;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

// At the top of test/index.test.js
const test = require('firebase-functions-test')();

// const functions = require('firebase-functions');
// const key = functions.config().stripe.key;
//
// // Mock functions config values
// test.mockConfig({ stripe: { key: '23wr42ewr34' }});

const admin = require('firebase-admin');

// If index.js calls admin.initializeApp at the top of the file,
// we need to stub it out before requiring index.js. This is because the
// functions will be executed as a part of the require process.
// Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
// const adminInitStub = sinon.stub(admin, 'initializeApp');
// Now we can require index.js and save the exports inside a namespace called myFunctions.
// after firebase-functions-test has been initialized
// const myFunctions = require('./group'); // relative path to functions code

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe('Cloud Functions', () => {
  let myFunctions;
  let adminInitStub;

  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp');
    myFunctions = require('./group');
  });

  after(() => {
    // Restore admin.initializeApp() to its original method.
    adminInitStub.restore();
    // Do other cleanup tasks.
    test.cleanup();
  });

  describe('addtestName', () => {
    let oldDatabase;
    before(() => {
      // Save the old database method so it can be restored after the test.
      oldDatabase = admin.database;
    });

    after(() => {
      // Restoring admin.database() to the original method.
      admin.database = oldDatabase;
    });

    it('should return a 303 redirect', (done) => {
      myFunctions.addGroup('testName', { userId: 1, snippetId: 1 });
      const promise = myFunctions.getGroupsByUserId(1);
      promise.then((querySnapshot) => {
        let docCount = 0;

        querySnapshot.forEach(doc => { 
          if (doc.data().users.hasOwnProperty('1')) {
            docCount++;
          }
        });

        assert(docCount === 2);
        done();
      }).catch(err => done());
    });
  });
});
