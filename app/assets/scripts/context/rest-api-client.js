import toasts from '../components/common/toasts';
import config from '../config';
import { fetchJSON } from './reducers/reduxeed';
const { restApiEndpoint } = config;

class RestApiClient {
  constructor(props) {
    this.accessToken = `Bearer ${props.apiToken}`;
    this.handleUnauthorized = props.handleUnauthorized;
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

    try {
      const res = await fetchJSON(url, options);
      return res.body;
    } catch (error) {
      if (error.statusCode === 401 && this.handleUnauthorized) {
        this.handleUnauthorized();
        toasts.error('You have been signed out.');
      } else {
        throw error;
      }
    }
  }

  get(path) {
    return this.fetch('GET', path);
  }

  post(path, data) {
    return this.fetch('POST', path, data);
  }

  patch(path, data) {
    return this.fetch('PATCH', path, data);
  }

  getApiMeta() {
    return this.get('');
  }

  getProject(id) {
    return this.get(`project/${id}`);
  }

  createProject(data) {
    return this.post('project', data);
  }

  getModel(id) {
    return this.get(`model/${id}`);
  }

  getCheckpoint(projectId, checkpointId) {
    return this.get(`project/${projectId}/checkpoint/${checkpointId}`);
  }

  getCheckpoints(projectId) {
    return this.get(`project/${projectId}/checkpoint`);
  }

  createInstance(projectId) {
    return this.post(`project/${projectId}/instance`, {});
  }

  getInstance(projectId, instanceId) {
    return this.get(`project/${projectId}/instance/${instanceId}`);
  }

  getActiveInstances(projectId) {
    return this.get(`project/${projectId}/instance/?status=active`);
  }

  bookmarkAOI(projectId, aoiId, name) {
    return this.patch(`project/${projectId}/aoi/${aoiId}`, {
      bookmarked: true,
      name
    })
  }
}

export default RestApiClient;
