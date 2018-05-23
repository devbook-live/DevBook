/* global describe beforeEach it */

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const { expect } = require('chai');
const React = require('react');
const enzyme = require('enzyme');
const { render } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { MemoryRouter } = require('react-router');
const { auth } = require('../../firebase/initFirebase');
const SingleNotebook = require('./SingleNotebook').default;

const adapter = new Adapter();
enzyme.configure({ adapter });

describe('SingleNotebook', () => {
  let singleNotebookWrapper;

  beforeEach(() => {
    const props = {
      params: { notebookId: 'Buffalo' },
      serverAwake: true,
    };

    singleNotebookWrapper = render(<MemoryRouter><SingleNotebook match={props} /></MemoryRouter>);

    auth.signInAnonymously()
      .then(() => singleNotebookWrapper.setState({ users: [auth.currentUser.uid] }))
      .then(() => console.warn('Hello'));
  });

  it('includes "Product Name" line as an h3', () => {
    console.log(singleNotebookWrapper.find('NotebookMetadata').length);
    expect([]).to.have.length(1);
    // expect(singleNotebookWrapper.is('NotebookMetadata')).to.have.length(1);
  });

  // it('includes "Product Name" line as an h3', () => {
  //   expect(singleNotebookWrapper.find('h3').text()).to.equal('ProductName');
  // });

  // it('includes "Price" line as span', () => {
  //   expect(singleNotebookWrapper.find('span').text()).to.equal('Price: $8');
  // });

  // it('includes "Image" line as img', () => {
  //   expect(singleNotebookWrapper.find('img').html()).to.equal('<img src="http://www.agecomputer.org/images/computerhappy.png" height="100" width="100"/>');
  // });

  // it('includes "Description" as p', () => {
  //   expect(singleNotebookWrapper.find('p').text()).to.equal('Product Description');
  // });
});
