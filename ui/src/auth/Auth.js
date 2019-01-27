import auth0 from 'auth0-js';

let AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
let AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
let AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
if (process.env.NODE_ENV !== 'development') {
  AUTH0_DOMAIN = window.AUTH0_DOMAIN;
  AUTH0_CLIENT_ID = window.AUTH0_CLIENT_ID;
  AUTH0_AUDIENCE = window.AUTH0_AUDIENCE;
}

class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.auth0 = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      audience: AUTH0_AUDIENCE,
      //process.env.REACT_APP_AUTH0_CALLBACK_URL,
      callbackUrl: location.href, // eslint-disable-line
      responseType: 'token id_token',
      scope: 'openid profile email'
    });
  }

  login = () => {
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push('/tasks');
      } else if (err) {
        this.history.push('/');
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.error(err);
      }
    });
  };

  setSession = authResult => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
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
      returnTo: location.href //eslint-disable-line
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
