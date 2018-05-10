import { markSnippetAsRunning, markSnippetAsDormant, snippetOutputListener } from '../crud/snippet';


/* the 'startRunCode' and 'stopRunCode' socket-like functions:  */

export const startRunCode = (snippetId) => {
  // 1. mark the snippet as 'running', so that
  //  (a) components can update w/ messages (may need to add info to the relevant notebook as well)
  //  (b) docker will know to run the code
  markSnippetAsRunning(snippetId);
  // 2. set up listener on "output" field.
  return snippetOutputListener(snippetId);
};

  // 3. when code finished running:
// call this when snippetListener !== null (?)
// at least this is what *should* be done when code is finished running,
// i.e. when docker's returned non-null output (say, an object of output info)
export const stopRunCode = (snippetId, snippetListenerToUnsubscribe) => {
  markSnippetAsDormant(snippetId);
  snippetListenerToUnsubscribe();
};
