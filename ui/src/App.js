import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Nav from './Nav';
import Auth from './auth/Auth';
import TasksPage from './tasks/TasksPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history);
  }

  componentDidMount() {
    if (window.location.hash.indexOf('access_token') !== -1) {
      this.auth.handleAuthentication();
    }
  }

  render() {
    return (
      <div className="container">
        <Nav auth={this.auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home auth={this.auth} {...props} />}
          />
          <Route
            path="/tasks"
            render={props =>
              this.auth.isAuthenticated() ? (
                <TasksPage auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </div>
      </div>
    );
  }
}

export default App;
