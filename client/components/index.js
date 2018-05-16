/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */


export { default as Navbar } from './navbar';
export { default as CodeSnippet } from './Snippet';
export { default as CodeOutput } from './Output';
export { default as NotebookFooter } from './NotebookFooter';
export { default as NotebookMetadata } from './NotebookMetadata';
export { default as PlayPauseDelete } from './PlayPauseDeleteBtns';

// components for which there are routes:
export { Login, Signup } from './auth-form';
export { default as AllGroups } from './AllGroups';
export { default as SingleGroup } from './SingleGroup';
export { default as AllUsers } from './AllUsers';
export { default as SingleUser } from './SingleUser';
export { default as EditProfile } from './SingleUser-EditProfile';
export { default as AllNotebooks } from './AllNotebooks';
export { default as SingleNotebook } from './SingleNotebook';
export { default as CreateGroup } from './CreateGroup';
// export { default as GroupHome } from './GroupHome';
export { default as DocsListByUserId } from './DocsListByUserId';
export { default as GroupsListByUserId } from './GroupsListByUserId';
export { default as CreateNotebook } from './CreateNotebook';
