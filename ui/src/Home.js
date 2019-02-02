import React, { Component } from 'react';

class Home extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated()) {
      this.props.history.push('/tasks');
    }
  }

  render() {
    return (
      <main className="flex">
        <div className="column-main tile">
          <h1>what gets measured gets improved</h1>
          <p>
            Simple taskpad app that lets you add tasks and tag them. Provide you
            with a dashboard to see where you have been spending your time!
          </p>
        </div>
      </main>
    );
  }
}

export default Home;
