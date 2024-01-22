import get from 'lodash.get';
import config from '../config';
import { fetchJSON } from './utils';
const { restApiEndpoint } = config;

class RestApiClient {
  constructor(props) {
    this.apiToken = props.apiToken;

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

    // Fetch data and let errors to be handle by the caller
    return fetchJSON(url, options).then((res) => res.body);
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

  delete(path) {
    return this.fetch('DELETE', path);
  }

  uploadFile(path, file) {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(this.getUrl(path), {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    }).then((response) => response.json());
  }

  getApiMeta() {
    return this.get('').then((apiMeta) => {
      // Calculate available slots
      const totalGpus = get(apiMeta, 'limits.total_gpus') || 0;
      const activeGpus = get(apiMeta, 'limits.active_gpus') || 0;
      const availableGpus =
        Number.isInteger(totalGpus) &&
        Number.isInteger(activeGpus) &&
        Math.max(totalGpus - activeGpus, 0);

      const totalCpus = get(apiMeta, 'limits.total_cpus') || 0;
      const activeCpus = get(apiMeta, 'limits.active_cpus') || 0;
      const availableCpus =
        Number.isInteger(totalCpus) &&
        Number.isInteger(activeCpus) &&
        Math.max(totalCpus - activeCpus, 0);

      return {
        ...apiMeta,
        availableInstances: {
          gpu: availableGpus,
          cpu: availableCpus,
        },
      };
    });
  }

  getProject(id) {
    return this.get(`project/${id}`);
  }

  deleteProject(id) {
    return this.delete(`project/${id}`);
  }

  createProject(data) {
    return this.post('project', data);
  }

  getModel(id) {
    return this.get(`model/${id}`);
  }

  getModelOsmTags(id) {
    return this.get(`model/${id}/osmtag`);
  }

  deleteModel(id) {
    return this.delete(`model/${id}`);
  }

  getAOIs(projectId) {
    return this.get(`project/${projectId}/aoi`);
  }

  deleteAoi(aoiId, projectId) {
    return this.delete(`project/${projectId}/aoi/${aoiId}`);
  }

  getCheckpoint(projectId, checkpointId) {
    return this.get(`project/${projectId}/checkpoint/${checkpointId}`);
  }

  getCheckpoints(projectId) {
    return this.get(`project/${projectId}/checkpoint`);
  }

  createInstance(projectId, params = {}) {
    return this.post(`project/${projectId}/instance`, params);
  }

  getInstance(projectId, instanceId) {
    return this.get(`project/${projectId}/instance/${instanceId}`);
  }

  getActiveInstances(projectId, instanceType) {
    return this.get(
      `project/${projectId}/instance/?status=active&type=${instanceType}`
    );
  }

  getTileJSON(projectId, aoiId) {
    return this.get(`project/${projectId}/aoi/${aoiId}/tiles`);
  }

  getTileJSONFromUUID(uuid) {
    return this.get(`share/${uuid}/tiles`);
  }

  bookmarkAOI(projectId, aoiId, name) {
    return this.patch(`project/${projectId}/aoi/${aoiId}`, {
      bookmarked: true,
      name,
    });
  }

  createShare(projectId, aoiId) {
    return this.post(`project/${projectId}/aoi/${aoiId}/share`);
  }

  patchAoi(projectId, aoiId, patches) {
    return this.patch(`project/${projectId}/aoi/${aoiId}`, {
      patches,
    });
  }

  getUserDetails() {
    return this.get('user/me');
  }
}

export default RestApiClient;
