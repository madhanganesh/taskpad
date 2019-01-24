import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Auth from './auth/Auth';
import Callback from './Callback';

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history);
  }

  componentDidMount() {
    //alert(window.location.hash);
    if (window.location.hash.indexOf('access_token') !== -1) {
      this.auth.handleAuthentication();
    }
  }

  render() {
    return (
      <>
        <Nav auth={this.auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home auth={this.auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback auth={this.auth} {...props} />}
          />
          <Route
            path="/profile"
            render={props =>
              this.auth.isAuthenticated() ? (
                <Profile auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </div>
      </>
    );
  }
}

export default App;
