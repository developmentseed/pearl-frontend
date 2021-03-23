import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import T from 'prop-types';
import { initialApiRequestState } from '../reducers/reduxeed';
import { createApiMetaReducer, queryApiMeta } from '../reducers/api';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import toasts from '../components/common/toasts';
import { useHistory, useParams } from 'react-router-dom';
import WebsocketClient from './websocket-client';
import GlobalContext from './global';
import predictionsReducer, {
  initialPredictionsState,
} from '../reducers/predictions';
import usePrevious from '../utils/use-previous';
import tBbox from '@turf/bbox';
import tBboxPolygon from '@turf/bbox-polygon';
import tCentroid from '@turf/centroid';

import config from '../config';

/**
 * Explore View Modes
 */
export const viewModes = {
  BROWSE_MODE: 'BROWSE_MODE',
  CREATE_AOI_MODE: 'CREATE_AOI_MODE',
  EDIT_AOI_MODE: 'EDIT_AOI_MODE',
  EDIT_CLASS_MODE: 'EDIT_CLASS_MODE',
};

/**
 * Context & Provider
 */
export const ExploreContext = createContext({});
export function ExploreProvider(props) {
  const history = useHistory();
  let { projectId } = useParams();
  const { restApiClient } = useContext(GlobalContext);

  const [currentProject, setCurrentProject] = useState(null);

  // Reference to Leaflet Rectangle layer created by
  // AOI draw control
  const [aoiRef, setAoiRef] = useState(null);

  // Float value that records square area of aoi
  const [aoiArea, setAoiArea] = useState(null);

  const [aoiName, setAoiName] = useState(null);

  // Aoi shape that is requested from API. used to initialize
  // Leaflet layer in the front end
  // eslint-disable-next-line
  const [aoiInitializer, setAoiInitializer] = useState(null);
  const [aoiList, setAoiList] = useState([]);

  //L.LatLngBounds object, set when aoi is confirmed
  const [aoiBounds, setAoiBounds] = useState(null);

  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);
  const [selectedModel, setSelectedModel] = useState(null);
  const [availableClasses, setAvailableClasses] = useState(null);

  const previousViewMode = usePrevious(viewMode);
  const [predictions, dispatchPredictions] = useReducer(
    predictionsReducer,
    initialPredictionsState
  );
  const [currentInstance, setCurrentInstance] = useState(null);
  const [websocketClient, setWebsocketClient] = useState(null);

  const [apiMeta, dispatchApiMeta] = useReducer(
    createApiMetaReducer,
    initialApiRequestState
  );

  useEffect(() => {
    showGlobalLoadingMessage('Checking API status...');
    queryApiMeta()(dispatchApiMeta);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      // Terminate instance on page unmount
      if (websocketClient) {
        websocketClient.terminateInstance();
      }
    };
  }, [websocketClient]);

  // Load project meta on load and api client ready
  useEffect(() => {
    async function loadProject() {
      if (projectId !== 'new') {
        showGlobalLoadingMessage('Loading project...');
        try {
          // Get project metadata
          const project = await restApiClient.getProject(projectId);

          setCurrentProject(project);

          const model = await restApiClient.getModel(project.model_id);

          setSelectedModel(model);

          const aois = await restApiClient.get(`project/${project.id}/aoi`);
          setAoiList(aois.aois);
          if (aois.total > 0) {
            const latest = aois.aois.lastItem;
            loadAoi(project, latest);
          }
        } catch (error) {
          toasts.error('Error loading project, please try again later.');
        } finally {
          hideGlobalLoading();
        }
      }
    }
    if (restApiClient) {
      loadProject();
    }
  }, [restApiClient]); // eslint-disable-line react-hooks/exhaustive-deps

  // If API is unreachable, redirect to home
  useEffect(() => {
    if (!apiMeta.isReady()) return;

    hideGlobalLoading();
    if (apiMeta.hasError()) {
      toasts.error('API is unavailable, please try again later.');
      history.push('/');
    }
  }, [apiMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!predictions) return;

    if (predictions.fetching) {
      const { processed, total } = predictions;
      if (!total) {
        showGlobalLoadingMessage(`Waiting for predictions...`);
      } else {
        showGlobalLoadingMessage(
          `Receiving images: ${processed} of ${total}...`
        );
      }
    } else {
      hideGlobalLoading();

      if (predictions.fetched) {
        restApiClient
          .get(`project/${currentProject.id}/aoi`)
          .then((aois) => setAoiList(aois.aois));
      }

      // Update aoi List with newest aoi
      // If predictions is ready, restApiClient must be ready

      if (predictions.error) {
        toasts.error('An inference error occurred, please try again later.');
      }
    }
  }, [predictions, restApiClient, currentProject]);

  /*
   * Re-init aoi state variables
   */
  function createNewAoi() {
    setViewMode(viewModes.CREATE_AOI_MODE);
    setAoiRef(null);
    setAoiBounds(null);
    setAoiArea(null);
    setAoiName(null);
  }

  async function loadAoi(project, aoiObject) {
    const aoi = await restApiClient.get(
      `project/${project.id}/aoi/${aoiObject.id}`
    );
    const [lonMin, latMin, lonMax, latMax] = tBbox(aoi.bounds);
    const bounds = [
      [latMin, lonMin],
      [latMax, lonMax],
    ];

    if (aoiRef) {
      // Load existing aoi that was returned by the api
      aoiRef.setBounds(bounds);
      setAoiBounds(aoiRef.getBounds());
      setAoiName(aoiObject.name);
      /*
      reverseGeoCode([lonMin, latMin, lonMax, latMax]).then((name) =>
        setAoiName(name)
      );*/
    } else {
      // initializing map with first aoi
      setAoiInitializer(bounds);
      setAoiName(aoiObject.name);
      /*
      reverseGeoCode([lonMin, latMin, lonMax, latMax]).then((name) =>
        setAoiName(name)
      );*/
    }
    return bounds;
  }

  function checkAoiName(name, aoiList) {}
  async function updateProjectName(projectName) {
    if (restApiClient) {
      let project = currentProject;

      //Create project if one does not already exist
      if (!project) {
        try {
          showGlobalLoadingMessage('Creating project...');
          project = await restApiClient.createProject({
            model_id: selectedModel.id,
            mosaic: 'naip.latest',
            name: projectName,
          });
          setCurrentProject(project);
          history.push(`/project/${project.id}`);
          hideGlobalLoading();
        } catch (error) {
          hideGlobalLoading();
          toasts.error('Could not create project, please try again later.');
        }
      } else {
        // just update project name
        restApiClient.patch(`project/${project.id}`, {
          name: projectName,
        });
      }
    }
  }

  /*
   * Reverse geocode using Bing
   *
   * @param bbox - should be turf bbox [minx, miny, maxX, maxY] or polygon feature
   */
  async function reverseGeoCode(bbox) {
    /*
    if (!aoiBounds) {
      console.error('defined bounds before reverse geocoding')
    }*/

    let center;
    if (Array.isArray(bbox)) {
      // Need to create a polygon
      center = tCentroid(tBboxPolygon(bbox));
    } else {
      // ASsume a polygon feature is provided
      center = tCentroid(bbox);
    }

    const [lon, lat] = center.geometry.coordinates;

    const address = await fetch(
      `${config.bingSearchUrl}/Locations/${lat},${lon}?radius=${config.reverseGeocodeRadius}&includeEntityTypes=address&key=${config.bingApiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .catch(() => {
        toasts.error('Error querying address');
        return null;
      });

    let name;
    if (address && address.resourceSets[0].estimatedTotal) {
      // Use first result if there are any
      name = address.resourceSets[0].resources[0].address.locality;
    } else {
      toasts.warn('AOI not geocodable, generic name used');
      name = 'Non-geocodable aoi';
    }
    // else leave name undefined, should be set by user
    return name;
  }

  async function runInference() {
    if (restApiClient) {
      let project = currentProject;
      let instance;

      if (!project) {
        try {
          showGlobalLoadingMessage('Creating project...');
          project = await restApiClient.createProject({
            model_id: selectedModel.id,
            mosaic: 'naip.latest',
            name: 'Untitled',
          });
          setCurrentProject(project);
          history.push(`/project/${project.id}`);
        } catch (error) {
          hideGlobalLoading();
          toasts.error('Could not create project, please try again later.');
          return; // abort inference run
        }
      }

      try {
        showGlobalLoadingMessage('Fetching classes...');
        const { classes } = await restApiClient.getModel(selectedModel.id);
        setAvailableClasses(classes);
      } catch (error) {
        hideGlobalLoading();
        toasts.error('Could fetch model classes, please try again later.');
        return; // abort inference run
      }

      if (!aoiName) {
        hideGlobalLoading();
        toasts.error('AOI Name must be set before running inference');
        return; // abort inference run
      }

      // Request a new instance if none is available.
      if (!websocketClient) {
        try {
          // Create instance
          showGlobalLoadingMessage('Requesting instance...');
          instance = await restApiClient.createInstance(project.id);

          // Setup websocket
          showGlobalLoadingMessage('Connecting to instance...');
          const newWebsocketClient = new WebsocketClient({
            token: instance.token,
            dispatchPredictions,
            onConnected: () =>
              newWebsocketClient.requestPrediction(aoiName, aoiRef),
          });

          setWebsocketClient(newWebsocketClient);
        } catch (error) {
          hideGlobalLoading();
          toasts.error(
            'Error while creating an instance, please try again later.'
          );
        }
      } else {
        // Send message with existing websocket
        websocketClient.requestPrediction(aoiName, aoiRef);
      }
    }
  }

  useEffect(() => {
    if (!aoiRef) {
      setAoiArea(null);
    }
  }, [aoiRef]);

  /*
   *
   * At this time we can also check to see if name needs to be incremented
   */
        /*
         * If AOI was just edited by the user, we need to increment
         * the name.
         * AOIs are tracked on backed as a grouped object of
         * AOI geometry AND model ID
         *
         * On frontend, assume that same name == same geometry.
         */

  useEffect(() => {
    if (!aoiBounds) {
      return;
    } else if (
      viewMode === viewModes.BROWSE_MODE &&
      (previousViewMode === viewModes.EDIT_AOI_MODE ||
        previousViewMode === viewModes.CREATE_AOI_MODE)
    ) {
      const bounds = [
        aoiBounds.getWest(),
        aoiBounds.getSouth(),
        aoiBounds.getEast(),
        aoiBounds.getNorth(),
      ];

      reverseGeoCode(bounds).then((name) => {
        let lastInstance;
        aoiList
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
          })
          .forEach((a) => {
            return (lastInstance = a.name.includes(name)
              ? a.name
              : lastInstance);
          });
        if (lastInstance) {
          if (lastInstance.includes('#')) {
            const [n, version] = lastInstance.split('#').map(w => w.trim());
            name = `${n} #${Number(version) + 1}`;
          } else {
            name = `${name} #${1}`;
          }
        }
        setAoiName(name);
      });
    }
  }, [aoiBounds, aoiList, viewMode, previousViewMode]);

  return (
    <ExploreContext.Provider
      value={{
        predictions,
        apiLimits:
          apiMeta.isReady() && !apiMeta.hasError() && apiMeta.getData().limits,

        previousViewMode,
        viewMode,
        setViewMode,

        aoiRef,
        setAoiRef,
        aoiArea,
        setAoiArea,
        aoiName,
        aoiInitializer,
        aoiList,

        createNewAoi,

        aoiBounds,
        setAoiBounds,

        loadAoi,

        currentInstance,
        setCurrentInstance,

        currentProject,
        setCurrentProject,

        selectedModel,
        setSelectedModel,

        updateProjectName,
        availableClasses,
        runInference,
        reverseGeoCode,
      }}
    >
      {props.children}
    </ExploreContext.Provider>
  );
}

ExploreProvider.propTypes = {
  children: T.node,
};
