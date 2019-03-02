/* eslint-disable */

import React, { Component } from 'react';
import moment from 'moment';

class Nav extends Component {
  state = {
    username: ''
  };

  componentDidMount() {
    this.setUserName();
  }

  componentDidUpdate() {
    this.setUserName();
  }

  setUserName = () => {
    if (this.state.username !== '') return;

    if (this.props.auth.isAuthenticated()) {
      this.props.auth.getProfile((profile, err) => {
        if (err) {
          return console.error(`error while retrieveing user profile: ${err}`);
        }
        this.setState({
          username: profile.given_name || profile.nickname || profile.email
        });
      });
    }
  };

  render() {
    const { isAuthenticated, login, logout } = this.props.auth;

    return (
      <div>
        <header>
          <h1>Taskpad</h1>
        </header>
        <nav>
          <ul className="site-nav">
            <li>
              <a href="/">Tasks</a>
            </li>
            <li>
              <a href="/reports">Reports</a>
            </li>
            <li className="nav-date">{moment().format('DD MMM YYYY')}</li>
            <li className="nav-username">{this.state.username}</li>
            <li style={{ marginLeft: '0.5em' }}>
              {isAuthenticated() ? (
                <a href="#" onClick={logout}>
                  Logout
                </a>
              ) : (
                <a href="#" onClick={login}>
                  Login
                </a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Nav;
