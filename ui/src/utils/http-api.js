import axios from 'axios';

import logger from '../utils/logger';
import notifier from '../utils/notifier';

class HttpApi {
  constructor() {
    this.auth = null;
  }

  init(auth) {
    this.auth = auth;
  }

  async get(url) {
    return this.request('get', url);
  }

  async post(url, data) {
    try {
      await this.request('post', url, data);
      return null;
    } catch (err) {
      logger.error(err);
      return err;
    }
  }

  async put(url, data) {
    try {
      await this.request('put', url, data);
      return null;
    } catch (err) {
      logger.error(err);
      return err;
    }
  }

  async delete(url) {
    try {
      await this.request('delete', url);
      return null;
    } catch (err) {
      logger.error(err);
      return err;
    }
  }

  async getWithErrorHandled(url) {
    try {
      const data = await this.get(url);
      return data;
    } catch (err) {
      logger.error(err);
      notifier.showSystemError();
    }
  }

  async getWithWarningHandled(url, message) {
    try {
      const data = await this.get(url);
      return data;
    } catch (err) {
      logger.error(err);
      notifier.showWarning(message);
    }
  }

  async request(method, url, data) {
    if (!this.auth.isAuthenticated()) {
      notifier.showError('You session is timeout. Loading login...');
      return this.auth.login();
    }
    try {
      const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.auth.getAccessToken()}`
        }
      });

      return response.data;
    } catch (err) {
      const error = err;
      console.error(error.response.status);
      if (error.response.status === 401) {
        notifier.showError('You session is timeout. Loading login...');
        return this.auth.login();
      }
      throw err;
    }
  }
}

const httpApi = new HttpApi();
export default httpApi;
