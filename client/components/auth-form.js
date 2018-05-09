import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
// import { auth } from '../store';
import { addUserFunction } from '../crud/user';

const { auth } = require('../../firebase/initFirebase');

<TextField
      name="password"
      hintText="Password"
      floatingLabelText="Password"
      floatingLabelFixed
      type="password"
    />

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;

  return (
    <div>
      <form onSubmit={handleSubmit} name={name}>
        <TextField
          name="email"
          floatingLabelText="Email"
        />
        <br />
        <TextField
          name="password"
          floatingLabelText="Password"
          type="password"
        />
        <div>
          <RaisedButton label={displayName} type="submit" primary />
        </div>
        {/* <button type="submit">{displayName}</button> */}

        {error && error.response && <div> {error.response.data} </div>}
      </form>
      <RaisedButton label={displayName} type="submit" primary />
      <RaisedButton
        href="/auth/google"
        label="Login with Google"
        style={styles.button}
        icon={<FontIcon className="muidocs-icon-custom-github" />}
        backgroundColor="#0D47A1"
        labelColor="#ffffff"
      />
      <RaisedButton
        href="/auth/github"
        label="Login with GitHub"
        style={ styles.button }
        icon={<FontIcon className="muidocs-icon-custom-github" />}
        backgroundColor="#EF6C00"
        labelColor="#ffffff"
      />
    </div>
  );
};

// Styles
const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
  };
};

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      console.log(formName);
      if (formName === 'signup') {
        console.log('got here');
        addUserFunction({ email, password });
      }
      // dispatch(auth(email, password, formName));
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
};
