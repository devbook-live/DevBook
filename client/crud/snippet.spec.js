/* global describe before beforeEach after afterEach it */

const { assert } = require('chai');
const sinon = require('sinon');

const admin = require('firebase-admin');
const test = require('firebase-functions-test')();

describe('CRUD for Snippets', () => {
  let snippetFns;
  let adminInitStub;
  before(() => {
    // [START stubAdminInit]
    // If index.js calls admin.initializeApp at the top of the file,
    // we need to stub it out before requiring index.js. This is because the
    // functions will be executed as a part of the require process.
    // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
    adminInitStub = sinon.stub(admin, 'initializeApp');
    // [END stubAdminInit]
    snippetFns = require('./snippet'); /* eslint-disable-line */
  });
  after(() => {
    // Restore admin.initializeApp() to its original method.
    adminInitStub.restore();
    // Do other cleanup tasks.
    test.cleanup();
  });

  let oldDatabase;
  beforeEach(() => {
    // Save the old database method so it can be restored after the test.
    oldDatabase = admin.database;
  });
  afterEach(() => {
    // Restoring admin.database() to the original method.
    admin.database = oldDatabase;
  });

  describe('Create ops', () => {
    describe('createSnippet', () => {
      it.only('Should return a db document reference to the created snippet', (done) => {
        const refParam = '/snippets';
        const pushParam = { original: 'input' };
        const databaseStub = sinon.stub();
        const refStub = sinon.stub();
        const pushStub = sinon.stub();
        // The following lines override the behavior of admin.database().ref('/snippets')
        // .push({ original: 'input' }) to return a promise that resolves with { ref: 'new_ref' }.
        // This mimics the behavior of a push to the database, which returns an object containing a
        // ref property representing the URL of the newly pushed item.

        Object.defineProperty(admin, 'database', { get: () => databaseStub });
        databaseStub.returns({ ref: refStub });
        refStub.withArgs(refParam).returns({ push: pushStub });
        pushStub.withArgs(pushParam).returns(Promise.resolve({ ref: 'new_ref' }));

        // [START assertHTTP]
        // A fake request object, with req.query.text set to 'input'
        // const req = { query: {text: 'input'} };
        const req = {
          text: 'blah blah',
          language: 'javascript',
          document: 'mock_doc_id',
          users: { mock_user_id1: true, mock_doc_id2: true },
          groups: { mock_group_id5: true },
        };
        // A fake response object, with a stubbed redirect function which asserts that it is called
        // with parameters 303, 'new_ref'.
        const res = {
          redirect: (code, url) => {
            assert.equal(code, 303);
            assert.equal(url, 'new_ref');
            done();
          },
        };

        // Invoke addMessage with our fake request and response objects. This will cause the
        // assertions in the response object to be evaluated.
        snippetFns.createSnippet(req, res);
        // [END assertHTTP]
      });
    });
  });
  // describe('Read ops', () => {
  //   describe('snippetById');
  //   describe('snippetsByUser');
  //   describe('snippetsByGroup');
  //   describe('snippetsByDoc');
  //   describe('snippetsByLang');
  //   describe('allSnippets');
  // });
  // describe('Update ops', () => {
  //   describe('updateSnippetText');
  //   describe('updateSnippetLang');
  //   describe('addSnippetAuthor');
  //   describe('removeSnippetAuthor');
  //   describe('addSnippetGroup');
  //   describe('removeSnippetGroup');
  //   describe('addSnippetDoc');
  //   describe('removeSnippetDoc');
  // });
  // describe('Delete ops', () => {
  //   describe('deleteSnippet');
  // });
});
