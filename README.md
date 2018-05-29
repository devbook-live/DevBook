# DevBook

[Deployed Site]()

## About

DevBook connects a front end React application with a Docker client to provide a seamless, shareable coding experience. DevBook utilizes CodeMirror to render an interactive text-editor, Google Cloud Firestore for real-time data management, and containerized Docker environments to run users’ code. As a team, we used an Agile workflow and quickly iterated through various solutions to explore how to efficiently run code in a browser environment.

## Setup

To use this app, you'll need to take the following steps:

* Run the following commands:

```
git clone https://github.com/devbook-live/DevBook.git
```

## Customize

Now that you've got the code, follow these steps to get acclimated:

* Update project name and description in `package.json` and `.travis.yml` files
* `npm install`, or `yarn install` - whatever you're into
* This file is `.gitignore`'d, and will *only* be required in your *development* environment

Follow firebase instructions and add your own information into your config object: 

```
<script src="https://www.gstatic.com/firebasejs/5.0.3/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: /* insert api key */,
    authDomain: /* "exampleText.firebaseapp.com",
    databaseURL: /* insert database URL */,
    projectId: /* insert projectId */,
    storageBucket: /* insert storageBucket*/,
    messagingSenderId: /* insert messagingSenderId */
  };
  firebase.initializeApp(config);
</script>
```

All of this info can be found in your Firebase console.

* To use OAuth with Google or other sites, go through Firebase OAuth and follow their steps.
  * You can get it from your Firebase console

## Start

`npm run start-dev` will make great things happen!

If you want to run the server and/or webpack separately, you can also `npm run start-server` and `npm run build-client`.

From there, just follow your bliss.

## Usage


## Credits

[Connor Jessup]() - 
[Jang Won Ko]() - 
[Fred Ma]() - 
[Ben Ellentuck]() -
