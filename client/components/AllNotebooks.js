import React, { Component } from 'react';
import { AllEntities } from './index';
import { allNotebooks } from '../crud/notebook';

// `notebooks`, `size`, and `title` are all optional props.
class AllNotebooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: props.notebooks || [],
      loading: true,
    };
  }

  componentDidMount() {
    if (!this.props.notebooks) {
      allNotebooks().then(notebooks => this.setState({
        notebooks: notebooks.docs,
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
        entities={this.state.notebooks}
        type="notebook"
        size="full-page"
        title={this.props.title || 'DevBook Notebooks'}
      />
    );
  }
}

export default AllNotebooks;
