/* global describe beforeEach it */

const { expect } = require('chai');
const test = require('firebase-functions-test')();


describe('CRUD for Snippets', () => {
  describe('Create ops', () => {
    describe('createSnippet', () => {});
  });
  describe('Read ops', () => {
    describe('snippetById', () => {});
    describe('snippetsByUser', () => {});
    describe('snippetsByGroup', () => {});
    describe('snippetsByDoc', () => {});
    describe('snippetsByLang', () => {});
    describe('allSnippets', () => {});
  });
  describe('Update ops', () => {
    describe('updateSnippetText', () => {});
    describe('updateSnippetLang', () => {});
    describe('addSnippetAuthor', () => {});
    describe('removeSnippetAuthor', () => {});
    describe('addSnippetGroup', () => {});
    describe('removeSnippetGroup', () => {});
    describe('addSnippetDoc', () => {});
    describe('removeSnippetDoc', () => {});
  });
  describe('Delete ops', () => {
    describe('deleteSnippet', () => {});
  });
});
