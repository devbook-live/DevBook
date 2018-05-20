import React, { Component } from 'react';
import { AllEntities } from './index';
import { allGroups } from '../crud/group';

// `users`, `size`, and `title` are all optional props.
class AllGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: props.groups || [],
      loading: true,
    };
  }

  componentDidMount() {
    if (!this.props.groups) {
      allGroups().then(groups => this.setState({
        groups: groups.docs,
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
        entities={this.state.groups}
        type="group"
        size="full-page"
        title={this.props.title || 'DevBook Groups'}
      />
    );
  }
}

export default AllGroups;
