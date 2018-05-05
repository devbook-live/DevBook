/*
This module initializes a firebase 'app' instance.
*/
import * as firebase from 'firebase';

// Initialize Firebase:
export default () => firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

/*
If the above options show up as undefined when firebase gets initialized (the resulting app object is currently console-logged), hard-code them in above (but don't commit that to github!). We'll figure out what's going on eventually...
*/
