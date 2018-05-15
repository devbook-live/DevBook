import React from 'react';

// Material UI imports
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

const LoggedIn = ({ logout, user }) => {
  console.log("LOGOUT::::: ", logout);
  console.log("USER::::: ", user);
  return (
    <IconMenu
      iconButtonElement={
        <IconButton>
          <Avatar
            style={{ paddingBottom: '10000 !important' }}
            src={
              user.photoURL
              ? user.photoURL
              : 'https://i0.wp.com/www.thisblogrules.com/wp-content/uploads/2010/02/batman-for-facebook.jpg?resize=250%2C280'
            }
          />
        </IconButton>
      }
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem primaryText="Profile" />
      <MenuItem primaryText="Notebooks" />
      <MenuItem primaryText="Sign out" onClick={() => logout()} />
    </IconMenu>
  );
};

export default LoggedIn;


//  <div>
//   {/* The navbar will show these links after you log in */}
//   <Link to="/home">Home</Link>
//   <Link to="/groups">Groups</Link>
//   <Link to="/testSnippet">Notebooks</Link>
//   <Link to="/groups/new">CreateGroup</Link>
//   <Link to="/groups/Group 2">Show SingleGroup (DEMO)</Link>
//   <Link to="/singleUser">Show SingleUser (DEMO)</Link>
//   <h3>Welcome, {this.state.displayName}</h3>
//   <Link onClick={this.logout} to="/login">Logout</Link>
// </div>
