import React from 'react';

// Material UI imports
import FlatButton from 'material-ui/FlatButton';
import { white } from 'material-ui/styles/colors';

const LogIn = () => (
  <div>
    <FlatButton
      style={{ color: white }}
      label="Sign Up"
      href="/signup"
    />
    <FlatButton
      style={{ color: white }}
      label="Login"
      href="/login"
    />
  </div>
);

export default LogIn;

// class Login extends Component {
//   static muiName = 'FlatButton';

//   render() {
//     return (
//       <FlatButton {...this.props} label="Login" />
//     );
//   }
// }
