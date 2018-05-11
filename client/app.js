import React from 'react';

import { Navbar } from './components';
import Routes from './routes';

const { auth, db } = require('../firebase/initFirebase');

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
