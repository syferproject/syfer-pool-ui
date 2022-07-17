export default class ApiHelper {
  constructor(options) {
    this.apiURL = options.state.appSettings.apiURL;
    // this.auth = options.Auth;
  }

  getConfig = () => {
    return this.fetch(`${this.apiURL}/config`)
      .then(res => Promise.resolve(res));
  };

  getNetworkStats = () => {
    return this.fetch(`${this.apiURL}/network/stats`)
      .then(res => Promise.resolve(res));
  };

  getPoolBlocks = () => {
    return this.fetch(`${this.apiURL}/pool/blocks`)
      .then(res => Promise.resolve(res));
  };

  getPoolMinersChart = () => {
    return this.fetch(`${this.apiURL}/pool/chart/miners`)
      .then(res => Promise.resolve(res));
  };

  getPoolStats = () => {
    return this.fetch(`${this.apiURL}/pool/stats`)
      .then(res => Promise.resolve(res));
  };

  fetch = (url, options) => {
    const headers = options?.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    // if (this.auth.loggedIn()) headers.token = this.auth.getToken();

    return fetch(url, { headers, ...options })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  _checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
