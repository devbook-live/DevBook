/* global describe beforeEach it */

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const { expect } = require('chai');
const React = require('react');
const { configure } = require('enzyme');
const { render } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { MemoryRouter } = require('react-router');
const { auth } = require('../../firebase/initFirebase');
const SingleNotebook = require('./SingleNotebook').default;

configure({ adapter: new Adapter() });

describe('SingleNotebook', () => {
  let singleNotebookWrapper;

  beforeEach(() => {
    const props = {
      params: { notebookId: 'Buffalo' },
      serverAwake: true,
    };

    singleNotebookWrapper = render(<MemoryRouter><SingleNotebook match={props} /></MemoryRouter>);

    auth.signInAnonymously()
      .then(() => singleNotebookWrapper.setState({ users: [auth.currentUser.uid] }));
  });

  it('includes NotebookMetadata', () => {
    // So this gets the child with the NotebookMetadata selector and makes sure it
    // is a NotebookMetadata element
    expect(singleNotebookWrapper.children('NotebookMetadata').is('NotebookMetadata'));
  });

  it('includes NotebookFooter', () => {
    expect(singleNotebookWrapper.children('NotebookFooter').is('NotebookFooter'));
  });

  it('includes CodeSnippet', () => {
    expect(singleNotebookWrapper.children('CodeSnippet').is('CodeSnippet'));
  });
});
