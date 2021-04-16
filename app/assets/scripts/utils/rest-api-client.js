import toasts from '../components/common/toasts';
import config from '../config';
import { fetchJSON } from '../context/reducers/reduxeed';
const { restApiEndpoint } = config;

class RestApiClient {
  constructor(props) {
    this.apiToken = props.apiToken;
    this.handleUnauthorized = props.handleUnauthorized;

    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add token if available
    if (this.apiToken) {
      this.defaultOptions.headers.Authorization = `Bearer ${this.apiToken}`;
    }
  }

  getUrl(subpath) {
    return `${restApiEndpoint}/api/${subpath}`;
  }

  async fetch(method, path, data, format = 'json') {
    const url = this.getUrl(path);
    const options = {
      ...this.defaultOptions,
      method,
      format,
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

  get(path, format = 'json') {
    return this.fetch('GET', path, null, format);
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

  getProjects(page, limit) {
    const offset = (page  - 1) * limit;
    return this.get(`project/?page=${offset}&limit=${limit}`);
  }

  createProject(data) {
    return this.post('project', data);
  }

  getModel(id) {
    return this.get(`model/${id}`);
  }

  getAOIs(projectId) {
    return this.get(`project/${projectId}/aoi`);
  }

  getBookmarkedAOIs(projectId) {
    return this.get(`project/${projectId}/aoi?bookmarked=true`);
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

  getTileJSON(projectId, aoiId) {
    return this.get(`project/${projectId}/aoi/${aoiId}/tiles`);
  }

  bookmarkAOI(projectId, aoiId, name) {
    return this.patch(`project/${projectId}/aoi/${aoiId}`, {
      bookmarked: true,
      name,
    });
  }

  downloadGeotiff(projectId, aoiId) {
    return this.get(
      `project/${projectId}/aoi/${aoiId}/download/color`,
      'binary'
    );
  }
}

export default RestApiClient;
