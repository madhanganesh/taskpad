import React, { Component } from 'react';

class Callback extends Component {
  componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error('Invalid callback URL.');
    }
  }

  render() {
    return <h1>Loading...</h1>;
  }
}

export default Callback;
