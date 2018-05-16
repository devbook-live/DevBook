import React, { Component } from 'react';

import { Navbar } from './components';
import Routes from './routes';

const app = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  );
};

export default app;
