import React from 'react';
import { Link } from 'react-router-dom';

// Material UI imports
import FlatButton from 'material-ui/FlatButton';
import { white } from 'material-ui/styles/colors';

const LogIn = () => (
  <div>
    <FlatButton
      style={{ color: white }}
      label="Sign Up"
      containerElement={<Link to="/signup" />}
    />
    <FlatButton
      style={{ color: white }}
      label="Login"
      containerElement={<Link to="/login" />}
    />
  </div>
);

export default LogIn;
