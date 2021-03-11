import config from '../config';
import { fetchJSON } from '../reducers/reduxeed';
const { restApiEndpoint } = config;

class RestApiClient {
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

  getProject(id) {
    return this.get(`project/${id}`);
  }

  createProject(data) {
    return this.post('project', data);
  }

  createInstance(projectId) {
    return this.post(`project/${projectId}/instance`, {});
  }

  getInstance(projectId, instanceId) {
    return this.get(`project/${projectId}/instance/${instanceId}`);
  }
}

export default RestApiClient;
