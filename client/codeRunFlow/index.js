import { markSnippetAsRunning, markSnippetAsDormant } from '../crud/snippet';


// setup for testing:
const mockDocker = () =>
  Promise.resolve({
    containerPath: null, // for running a container *within* our app - e.g. to display a React component within that container. Perhaps docker would spin up a client at a url -- which we would get in this object -- that we could access in an iframe
    // probably ultimately we would just have a url we could always access, to look at whatever happened in the container.
    staticCodeResult: 'Hello, World!', // or maybe we just have a static result.
  });

/* the 'runCode' socket-like function */
// Inputs:
// clientId = the client who clicked "run code" on a particular snippet
// snippetId = the snippet to be run
// docId = the doc including the snippet to be run
// dockerIndexContents = { configs, code }
const runCode = (clientId, snippetId, docId, dockerIndexContents) => {
  // 1. run the code:
  const runCodeResults = mockDocker(dockerIndexContents);
  // 2. mark the snippet as 'running', so components can update w/ messages:
  markSnippetAsRunning(snippetId);
  // 3. when code finished running:
  return runCodeResults
    .then(results => results)
    .catch((error) => { // basically a 500 server error - something wrong w/ docker
      return { error };
    })
    .finally(() => markSnippetAsDormant(snippetId));
};

export default runCode;


// notes (most of which are now in `notes.md`)

// import { clientsByDoc } from '../crud/document';
// import { userById } from '../crud/user';
//`runCodeNotification(clientId, snippetId, docId);`
// this could go in the component...
// Sends a message to all current clients for doc, IFF more than 1 current client.
// seems that we may be able to associate a clientId with a given user, to get their name, to let everyone else know who clicked "run"
// for now, assuming we can do something like:
//  users.findById(clientId).then(user => user.name)
// const runCodeNotification = async (clientId, docId) => {
//   const clients = await clientsByDoc(docId);
//   const userMessage = 'Running your code...';
//   let groupMessage = null;
//   if (Object.keys(clients).length > 1) {
//     // send message to everyone else that code is being run
//     const userName = userById(clientId);
//     groupMessage = `${userName} is running code...`;
//   }
//   // either way, tell client who ran code that their code is being run

// };

/*

Here's the flow:
- (optionally) `createDoc`  (`createDoc` from documents crud)
- `loadDoc` --> adds client to *current* clients for doc (`docById` + `addDocClient`).
- (optionally) `addSnippet` --> basically just createSnippet + addSnippetToDoc. stick to that
- `runCode` (for a given snippet in the current doc)
-- (passes code on to docker as "indexContents")
-- (logs that this user has run this snippet -- users could have field like: {
  snippetsRun: {
    fbayeurb: 0,
    nivybauy: 4,
    yabvibte: 25,
    aygrbuvs: 6,
  }
})
-- emits: `runCodeNotification` to all current clients for doc, IFF more than 1 current client.

THEN
- on Failure: emits `runCodeErrorNotification` to *all* current clients for doc. (e.g. there was some security risk or something where we didn't even get to try to execute the code - may not need this.)
- on Success: (i.e., at least we *tried* to run the code): -- with results, image, whatever this may be --
-- emits: `getResults` to all current clients for doc.

FINALLY
- `quit` --> removes client from *current* clients for doc.

*/

// not sure how we'd generate "clientId" but let's assume we have it. Really, we just need a socket id. So perhaps that will be the way to go about this in the future.


/*
  Supports the following Firebase functions:
  #`addClientToDoc`#
  - Happens when a client loads a document. Via firebase "session" equivalent.
  - What does it do?
  -- adds client to 'currentClients' field for the current Document.

  #`removeClientFromDoc`#
  - Happens when a client leaves a document page (or after a certain amount of time, whichever comes *last*).
  - What does it do?
  -- removes client from 'currentClients' field for the current Document.

  #`addSnippetToDoc` wrapper#
  - Happens when a client adds a new snippet to a document. Basically a wrapper around `createSnippet`.
  - What does it do?
  -- `createSnippet` + `addSnippetToDoc`.
  --- I.e., everything `createSnippet` does, *plus* adds the snippet *to the doc*:
  --- document: {
    snippets: {
      abcdefg: true
    }
  }
  **AND**
  --- adds to the Image collection:
    images: {
      abcdefg: {
        configs: {},
        code: {},
        currentClients: {
          // all clients in the 'currentClients' field for the current Document.
        } // (necessary??)
      }
    }
  (...& maybe... )
  --- adds a new "image" to the Containers collection in Firestore. E.g.:
    containers: {
      node: {
        images: {
          abcdefg: true
        }
      },
      react: {
        images: {}
      },
    }

    (what's the difference between an image and a container...?)


    #`removeSnippetFromDoc` wrapper#
  - Happens when a client deletes a snippet. Basically a wrapper around `deleteSnippet`.
  - Should take in the current user's info (see fb session Qs)
  - What does it do?
  -- `deleteSnippet` + `addSnippetToDoc`.
  -- should also send a toast notification that so-and-so has removed the snippet (and a slightly modified version of this to the user who *did* the deleting).

  #`runCode`#
  - Happens when client runs snippet from document.
*/
