import React, { Component } from 'react';
import { AllEntities } from './index';
import { allUsers } from '../crud/user';

// `users`, `size`, and `title` are all optional props.
class AllUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users || [],
      loading: true,
    };
  }

  componentDidMount() {
    if (!this.props.users) {
      allUsers().then(users => this.setState({
        users: users.docs,
        loading: false,
      }));
    } else {
      Promise.resolve().then(() => this.setState({ loading: false }));
    }
  }

  render() {
    if (this.state.loading) {
      return <p className="loading">Loading...</p>;
    }
    return (
      <AllEntities
        entities={this.state.users}
        type="user"
        size="full-page"
        title={this.props.title || 'The DevBook Community'}
      />
    );
  }
}

export default AllUsers;
