import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const { auth } = require('../../firebase/initFirebase');

export default class Navbar extends Component {
  // setting logged in user to pass to components as props.
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // console.log('NEXT PROPSSSS: ', nextProps);
  //   // console.log('PREV STATEEEE: ', prevState);
  //   return (
  //     auth.onAuthStateChanged((user) => {
  //       if (user.email) {
  //         console.log('GOTTTT HEEERRREEE', user.email);
  //         return { isLoggedIn: true };
  //       }
  //       return null;
  //     })
  //   );
  // }

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('GOTTTT HEEERRREEE', user.email);
        this.setState({ isLoggedIn: true });
      } else {
        this.setState({ isLoggedIn: false });
      }
    });
  }

  logout() {
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log('Sign-out successful: ', auth.currentUser);
    }, (error) => {
      // An error happened.
      console.error(error);
    });
  }

  render() {
    console.log('STATEEEE: ', this.state);
    console.log('LOGGED IN: ', this.state.isLoggedIn);
    return (
      <div>
        <h1>SNIPPETS</h1>
        <nav>
          {this.state.isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Link to="/home">Home</Link>
              <a href="#" /* onClick={handleClick} */ >
                Logout
              </a>
              <Link onClick={this.logout} to="/login">Logout</Link>
            </div>
          ) : (
            <div>
              {/* The navbar will show these links before you log in */}
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/testSnippet">Example Snippet</Link>
              <Link to="/CreateGroup">CreateGroup</Link>
              <Link onClick={this.logout} to="/login">Logout</Link>
            </div>
          )}
        </nav>
        <hr />
      </div>
    );
  }
}

/**
 * CONTAINER
 */
// const mapState = (state) => {
//   return {
//     isLoggedIn: !!state.user.id,
//   };
// };

// const mapDispatch = (dispatch) => {
//   return {
//     handleClick() {
//       dispatch(logout());
//     },
//   };
// };

// export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
// Navbar.propTypes = {
//   handleClick: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired,
// };
