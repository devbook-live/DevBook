/*
This module initializes a firebase 'app' instance.
*/
const firebase = require('firebase');
require('firebase/firestore');
// require('firebase/auth');


// // Initialize Firebase:
// firebase.initializeApp({
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
// });

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyA3Gjq9-4MuPFauhHzk6pGAjoQMC4I4dz0',
  authDomain: 'codesnippets-c9eee.firebaseapp.com',
  databaseURL: 'https://codesnippets-c9eee.firebaseio.com',
  projectId: 'codesnippets-c9eee',
  storageBucket: 'codesnippets-c9eee.appspot.com',
  messagingSenderId: '846625889305',
};
firebase.initializeApp(config);


/*
If the above options show up as undefined when firebase gets initialized (the resulting app object is currently console-logged), hard-code them in above (but don't commit that to github!). We'll figure out what's going on eventually...
*/

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
// console.log('AUTH: ', firebase.auth);
// const auth = firebase.auth();


// export default db;
module.exports = {
  db,
  // auth,
};
