# Here's the flow:
## first:
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

## then:
- on Failure: emits `runCodeErrorNotification` to *all* current clients for doc. (e.g. there was some security risk or something where we didn't even get to try to execute the code - may not need this.)
- on Success: (i.e., at least we *tried* to run the code): -- with results, image, whatever this may be --
-- emits: `getResults` to all current clients for doc.

## finally:
- `quit` --> removes client from *current* clients for doc.

*/



/*
  necessitates the following Firebase functions:
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
