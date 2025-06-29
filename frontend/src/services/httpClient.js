class HttpClient {
  _baseURL = "http://localhost:3001/api";

  async get(url, params) {
    const paramsString = params ? new URLSearchParams(params).toString() : '';

    return await fetch(this._baseURL + url + '?' + paramsString);
  }
}

export const httpClient = new HttpClient();