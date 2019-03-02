import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './home/Home';
import Nav from './header/Nav';
import Auth from './auth/Auth';
import TasksPage from './tasks/TasksPage';
import ReportsPage from './reports/ReportsPage';

import httpApi from './utils/http-api';

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth();
    httpApi.init(this.auth);
  }

  componentDidMount() {
    if (window.location.hash.indexOf('access_token') !== -1) {
      this.auth.handleAuthentication(err => {
        if (err) {
          this.history.push('/');
          alert(`Error: ${err.error}. Check the console for further details.`);
          console.error(err);
          return;
        }
        this.props.history.push('/tasks');
      });
    }
  }

  render() {
    return (
      <div className="container">
        <ToastContainer />
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
          <Route
            path="/reports"
            render={props =>
              this.auth.isAuthenticated() ? (
                <ReportsPage auth={this.auth} {...props} />
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
