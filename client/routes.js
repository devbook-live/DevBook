/* eslint-disable max-len */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  Login,
  Signup,
  AllGroups,
  SingleGroup,
  AllUsers,
  SingleUser,
  AllNotebooks,
  SingleNotebook,
  CreateGroup,
} from './components';
import Snippet from './components/Snippet';

/**
 * COMPONENT
 */
const Routes = () => (
  <Switch>
    {/* Routes placed here are available to all visitors */}
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />

    <Route path="/testSnippet" component={Snippet} />

    <Route exact path="/groups" component={AllGroups} /> {/* all groups ever */}
    <Route path="/groups/:groupId" component={SingleGroup} /> {/* this group */}
    <Route path="/groups/:groupId/users" component={AllUsers} /> {/* filtered by who's in this group */}
    <Route path="/groups/:groupId/notebooks" component={AllNotebooks} /> {/* all notebooks for this group */}
    <Route exact path="/groups/new" component={CreateGroup} />

    <Route exact path="/users" component={AllUsers} /> {/* all users ever */}
    <Route path="/users/:userId" component={SingleUser} /> {/* this user */}
    <Route path="/users/:userId/groups" component={AllGroups} /> {/* filtered by who's in this user */}
    <Route path="/users/:userId/notebooks" component={AllNotebooks} /> {/* all notebooks for this user */}

    <Route exact path="/notebooks" component={AllNotebooks} /> {/* created by anyone, ever */}
    <Route path="/notebooks/:notebookId" component={SingleNotebook} /> {/* this notebook */}

    {
      /*
      web security standing questions:
        - what routes can an anonymous user not access?
        - what routes can a logged-in, non-admin user not access?
        - should group editing be limited to only some logged-in users?
        - how can we prevent the malicious creation of an admin user in firestore? (see firestore db "rules")
      */
    }

    {/* Displays our Login component as a fallback */}
    <Route component={SingleNotebook} /> {/* empty notebook */}
  </Switch>
);

export default Routes;
