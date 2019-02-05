import auth0 from 'auth0-js';

import {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE,
  AUTH0_CALLBACK
} from '../utils/auth-params';

class Auth {
  constructor() {
    this.userProfile = null;
    this.auth0 = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      audience: AUTH0_AUDIENCE,
      redirectUri: AUTH0_CALLBACK,
      responseType: 'token id_token',
      scope: 'openid profile email'
    });
  }

  login = () => {
    this.auth0.authorize();
  };

  handleAuthentication = done => {
    this.auth0.parseHash((err, authResult) => {
      if (err) return done(err);

      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        done();
      } else {
        done({ err: 'error during authentication. check console' });
      }
    });
  };

  setSession = authResult => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    console.log(expiresAt);
    console.log(authResult.expiresIn);

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  };

  isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  };

  logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    this.auth0.logout({
      clientID: AUTH0_CLIENT_ID,
      returnTo: AUTH0_CALLBACK
    });
  };

  getIdToken = () => {
    const idToken = localStorage.getItem('id_token');
    if (!idToken) {
      throw new Error('No id token found.');
    }
    return idToken;
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found.');
    }
    return accessToken;
  };

  getProfile = cb => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };
}

export default Auth;
