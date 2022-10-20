export default class ApiHelper {
  constructor(auth) {
    this.apiURL = process.env.REACT_APP_API_ENDPOINT;
    this.auth = auth;
  }

  qs = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

  getConfig = () => {
    return this.fetch(`${this.apiURL}/config`)
      .then(res => Promise.resolve(res));
  }

  getMinerChart = address => {
    return this.fetch(`${this.apiURL}/miner/${address}/chart/hashrate/allWorkers`)
      .then(res => Promise.resolve(res));
  }

  getMinerIdentifiers = address => {
    return this.fetch(`${this.apiURL}/miner/${address}/identifiers`)
      .then(res => Promise.resolve(res));
  }

  getMinerPayments = (address, page, limit) => {
    const params = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    return this.fetch(`${this.apiURL}/miner/${address}/payments?${this.qs(params)}`)
      .then(res => Promise.resolve(res));
  }

  getMinerStats = address => {
    return this.fetch(`${this.apiURL}/miner/${address}/stats`)
      .then(res => Promise.resolve(res));
  }

  getMinerWorkers = address => {
    return this.fetch(`${this.apiURL}/miner/${address}/stats/allWorkers`)
      .then(res => Promise.resolve(res));
  }

  getNetworkStats = () => {
    return this.fetch(`${this.apiURL}/network/stats`)
      .then(res => Promise.resolve(res));
  }

  getPoolBlocks = (page, limit, poolType = undefined) => {
    return this.fetch(`${this.apiURL}/pool/blocks${poolType ? `/${poolType}` : ''}?${this.qs({ limit, page })}`)
      .then(res => Promise.resolve(res));
  }

  getPoolMinersChart = () => {
    return this.fetch(`${this.apiURL}/pool/chart/miners`)
      .then(res => Promise.resolve(res));
  }

  getPoolStats = (poolType = undefined) => {
    return this.fetch(`${this.apiURL}/pool/stats${poolType ? `/${poolType}` : ''}`)
      .then(res => Promise.resolve(res));
  }

  // Auth

  getUserSettings = () => {
    return this.fetch(`${this.apiURL}/authed`)
      .then(res => Promise.resolve(res));
  }

  changePassword = password => {
    const body = JSON.stringify({ password });
    return this.fetch(`${this.apiURL}/authed/changePassword`, { method: 'POST', body })
      .then(res => Promise.resolve(res));
  }

  changePayoutThreshold = threshold => {
    const body = JSON.stringify({ threshold });
    return this.fetch(`${this.apiURL}/authed/changePayoutThreshold`, { method: 'POST', body })
      .then(res => Promise.resolve(res));
  }

  toggleEmail = () => {
    const body = JSON.stringify({});
    return this.fetch(`${this.apiURL}/authed/toggleEmail`, { method: 'POST', body })
      .then(res => Promise.resolve(res));
  }

  fetch = (url, options) => {
    const headers = options?.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.auth.loggedIn()) headers['x-access-token'] = this.auth.getToken();

    return fetch(url, { headers, ...options })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
