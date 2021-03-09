/**
 * Performs a request to the given url returning the response in json format
 * or throwing an error.
 *
 * @param {string} url Url to query
 * @param {object} options Options for fetch
 */
export async function fetchJSON(url, options) {
  let response;
  try {
    response = await fetch(url, options);
    const json = await response.json();

    if (response.status >= 400) {
      const err = new Error(json.message);
      err.statusCode = response.status;
      err.data = json;
      throw err;
    }

    return { body: json, headers: response.headers };
  } catch (error) {
    error.statusCode = response ? response.status || null : null;
    throw error;
  }
}

import config from '../config';
const { restApiEndpoint } = config;

class ApiClient {
  constructor(props) {
    this.accessToken = `Bearer ${props.apiToken}`;
  }

  getUrl(subpath) {
    return `${restApiEndpoint}/api/${subpath}`;
  }

  async fetch(method, path, data) {
    const url = this.getUrl(path);
    const options = {
      method,
      headers: {
        Authorization: this.accessToken,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const res = await fetchJSON(url, options);
    return res.body;
  }

  get(path) {
    return this.fetch('GET', path);
  }

  post(path, data) {
    return this.fetch('POST', path, data);
  }

  createProject(data) {
    return this.post('project', data);
  }

  createInstance(projectId) {
    return this.post(`project/${projectId}/instance`, {});
  }

  getInstance(projectId, instanceId) {
    return this.post(`project/${projectId}/instance/${instanceId}`);
  }
}

export default ApiClient;
