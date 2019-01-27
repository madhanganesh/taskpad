// eslint-ignore jsx-a11y/anchor-is-valid
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
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
              <a href="/pricing">Reports</a>
            </li>
            <li className="nav-right">
              {this.props.auth.isAuthenticated() ? (
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
