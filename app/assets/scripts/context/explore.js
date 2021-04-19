import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useContext,
  useMemo,
} from 'react';
import T from 'prop-types';
import { useAuth } from './auth';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import toasts from '../components/common/toasts';
import { useHistory, useParams } from 'react-router-dom';
import { actions as predictionActions, usePredictions } from './predictions';
import { mapStateReducer, mapModes, mapActionTypes } from './reducers/map';
import tBbox from '@turf/bbox';
import reverseGeoCode from '../utils/reverse-geocode';

import { actions as checkpointActions, useCheckpoint } from './checkpoint';
import { wrapLogReducer } from './reducers/utils';
import { useAoi, useAoiPatch } from './aoi';
import { useProject } from './project';
import { useModel } from './model';
import { useInstance } from './instance';
import logger from '../utils/logger';

/**
 * Context & Provider
 */
export const ExploreContext = createContext(null);

export function ExploreProvider(props) {
  const history = useHistory();
  let { projectId } = useParams();

  const { restApiClient, isLoading: authIsLoading } = useAuth();
  const { currentProject, setCurrentProject } = useProject();
  const { aoiName, aoiRef, setAoiName, setAoiRef, setCurrentAoi } = useAoi();
  const { predictions, dispatchPredictions } = usePredictions();
  const { selectedModel, setSelectedModel } = useModel();
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const {
    aoiPatch,
    dispatchAoiPatch,
    aoiPatchList,
    setAoiPatchList,
  } = useAoiPatch();

  // The following properties should be moved to own context to avoid re-rendering.
  const [aoiArea, setAoiArea] = useState(null);
  const [aoiInitializer, setAoiInitializer] = useState(null);
  const [aoiList, setAoiList] = useState([]);
  const [aoiBounds, setAoiBounds] = useState(null);
  const [mapState, dispatchMapState] = useReducer(
    wrapLogReducer(mapStateReducer),
    {
      mode: mapModes.BROWSE_MODE,
    }
  );
  const [checkpointList, setCheckpointList] = useState(null);
  const [currentInstance, setCurrentInstance] = useState(null);
  const { setInstanceStatusMessage, initInstance } = useInstance();

  async function loadInitialData() {
    showGlobalLoadingMessage('Loading configuration...');

    // Bypass loading project when new
    if (projectId === 'new') {
      hideGlobalLoading();
      return;
    }

    try {
      // Get project metadata
      showGlobalLoadingMessage('Fetching project metadata...');
      const project = await restApiClient.getProject(projectId);
      setCurrentProject(project);

      showGlobalLoadingMessage('Fetching model...');
      const model = await restApiClient.getModel(project.model_id);
      setSelectedModel(model);

      showGlobalLoadingMessage('Fetching areas of interest...');
      const aois = await restApiClient.get(`project/${project.id}/aoi`);

      const filteredList = filterAoiList(aois.aois);
      setAoiList(filteredList);
      if (aois.total > 0) {
        const latest = filteredList[filteredList.length - 1];
        loadAoi(project, latest);
      }

      showGlobalLoadingMessage('Fetching checkpoints...');
      const { checkpoints } = await loadCheckpointList(projectId);
      const checkpoint = checkpoints[0];

      showGlobalLoadingMessage('Looking for active GPU instances...');
      const instance = await initInstance(
        project.id,
        checkpoint && checkpoint.id
      );

      setCurrentInstance(instance);
    } catch (error) {
      logger(error);
      toasts.error('Error loading project, please try again later.');
    } finally {
      hideGlobalLoading();
    }
  }

  async function loadCheckpointList(projectId) {
    const checkpointsMeta = await restApiClient.getCheckpoints(projectId);
    if (checkpointsMeta.total > 0) {
      // Save checkpoints if any exist, else leave as null
      setCheckpointList(checkpointsMeta.checkpoints);
    }
    return checkpointsMeta;
  }

  // Load project meta on load and api client ready
  useEffect(() => {
    if (!authIsLoading && restApiClient) {
      loadInitialData();
    }
  }, [authIsLoading, restApiClient]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (predictions.fetching) {
      const { processed, total } = predictions;
      if (!total) {
        setInstanceStatusMessage(`Waiting for predictions...`);
      } else {
        setInstanceStatusMessage(
          `Receiving images ${processed} of ${total}...`
        );
      }
    } else if (predictions.isReady()) {
      hideGlobalLoading();

      // Update aoi List with newest aoi
      // If predictions is ready, restApiClient must be ready

      if (predictions.fetched) {
        restApiClient.get(`project/${currentProject.id}/aoi/`).then((aois) => {
          setAoiList(filterAoiList(aois.aois));
        });
        // Refresh checkpoint list, prediction finished
        // means new checkpoint available
        loadCheckpointList(currentProject.id);
      }

      if (predictions.error) {
        toasts.error('An inference error occurred, please try again later.');
      } else {
        loadMetrics();
      }
    }
  }, [predictions, restApiClient, currentProject]);

  useEffect(() => {
    if (aoiPatch.fetching) {
      const { processed, total } = aoiPatch;
      if (!total) {
        showGlobalLoadingMessage(`Waiting for patch predictions...`);
      } else {
        showGlobalLoadingMessage(
          `Receiving images: ${processed} of ${total}...`
        );
      }
    } else if (aoiPatch.isReady()) {
      hideGlobalLoading();

      if (aoiPatch.fetched) {
        const updatedPatchList = [...aoiPatchList, aoiPatch.getData()];
        setAoiPatchList(updatedPatchList);
        restApiClient.patchAoi(
          currentProject.id,
          predictions.data.aoiId,
          updatedPatchList.map((p) => p.id)
        );
      } else if (aoiPatch.error) {
        toasts.error('An error ocurred while requesting aoi patch.');
        logger(aoiPatch.error);
      }
    }
  }, [aoiPatch, predictions, restApiClient, currentProject]);

  async function loadMetrics() {
    await restApiClient
      .get(`project/${currentProject.id}/checkpoint/${currentCheckpoint.id}`)
      .then((ckpt) => {
        if (ckpt.analytics) {
          dispatchCurrentCheckpoint({
            type: checkpointActions.RECEIVE_ANALYTICS,
            data: { analytics: ckpt.analytics },
          });
        }
      });
  }

  /*
   * Clear predictions on AOI Edit
   */
  useEffect(() => {
    if (predictions.isReady()) {
      if (
        mapState.mode === mapModes.BROWSE_MODE &&
        mapState.previousMode === mapModes.EDIT_AOI_MODE
      ) {
        dispatchPredictions({ type: predictionActions.CLEAR_PREDICTION });

        dispatchCurrentCheckpoint({
          type: checkpointActions.RESET_CHECKPOINT,
        });
      }
    }
  }, [mapState, predictions]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * Re-init aoi state variables
   */
  function createNewAoi() {
    dispatchMapState({
      type: mapActionTypes.SET_MODE,
      data: mapModes.CREATE_AOI_MODE,
    });
    setAoiRef(null);
    setAoiBounds(null);
    setAoiArea(null);
    setAoiName(null);

    //clear inference tiles
    dispatchCurrentCheckpoint({
      type: checkpointActions.RESET_CHECKPOINT,
    });

    //clear inference tiles
    dispatchPredictions({
      type: predictionActions.CLEAR_PREDICTION,
    });
  }

  /*
   * Filter the aoi list to have unique names
   * Back end doesn't care if aoi's are submitted with duplicate names.
   * On frontend, assume that equivalent name -> equivalent geometry
   * Only update the name if the geometry has been edited
   *
   */
  function filterAoiList(aoiList) {
    const aois = new Map();
    aoiList.forEach((a) => {
      if (aois.has(a.name)) {
        if (aois.get(a.name).created > a.created) {
          aois.set(a.name, a);
        }
      } else {
        aois.set(a.name, a);
      }
    });
    return Array.from(aois.values());
  }

  /*
   * Utility function to load AOI
   * @param project - current project object
   * @param aoiObject - object containing aoi id and name
   *                  Objects of this format are returned by
   *                  aoi listing endpoint
   */

  async function loadAoi(project, aoiObject) {
    showGlobalLoadingMessage('Loading AOI');
    const aoi = await restApiClient.get(
      `project/${project.id}/aoi/${aoiObject.id}`
    );

    setCurrentAoi(aoi);

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
      dispatchMapState({
        type: mapActionTypes.SET_MODE,
        data: mapModes.ADD_CLASS_SAMPLES,
      });
      if (predictions.isReady) {
        dispatchPredictions({ type: predictionActions.CLEAR_PREDICTION });
      }

      if (currentCheckpoint) {
        dispatchCurrentCheckpoint({
          type: checkpointActions.RESET_CHECKPOINT,
        });
      }
    } else {
      // initializing map with first aoi
      setAoiInitializer(bounds);
      setAoiName(aoiObject.name);
    }

    hideGlobalLoading();
    return bounds;
  }

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

  async function updateCheckpointName(name) {
    try {
      showGlobalLoadingMessage('Updating checkpoint name');
      await restApiClient.patch(
        `/project/${currentProject.id}/checkpoint/${currentCheckpoint.id}`,
        {
          name,
          bookmarked: true,
        }
      );
      dispatchCurrentCheckpoint({
        type: checkpointActions.SET_CHECKPOINT_NAME,
        data: {
          name,
        },
      });

      loadCheckpointList(currentProject.id);
      hideGlobalLoading();
    } catch (error) {
      toasts.error('Error updating checkpoint');
    }
  }

  useEffect(() => {
    if (!aoiRef) {
      setAoiArea(null);
    }
  }, [aoiRef]);

  /*
   * This useEffect GeoCodes an AOI after it is created.
   * On the front end we assume that any AOI with the same name
   * from the backend, will have the same geometry.
   *
   * To deal with this, any AOI that has the same geocoding as an existing one will be incremented.
   *
   * i.e. Seneca Rocks, Seneca Rocks #1, Seneca Rocks #2...etc
   */

  useEffect(() => {
    if (!aoiBounds) {
      return;
    } else if (
      mapState.mode === mapModes.BROWSE_MODE &&
      (mapState.previousMode === mapModes.EDIT_AOI_MODE ||
        mapState.previousMode === mapModes.CREATE_AOI_MODE)
    ) {
      const bounds = [
        aoiBounds.getWest(),
        aoiBounds.getSouth(),
        aoiBounds.getEast(),
        aoiBounds.getNorth(),
      ];

      showGlobalLoadingMessage('Geocoding AOI...');
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
            const [n, version] = lastInstance.split('#').map((w) => w.trim());
            name = `${n} #${Number(version) + 1}`;
          } else {
            name = `${name} #${1}`;
          }
        }
        setAoiName(name);
        hideGlobalLoading();
      });
    }
  }, [mapState, aoiBounds, aoiList]);

  return (
    <ExploreContext.Provider
      value={{
        predictions,

        mapState,
        dispatchMapState,

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

        dispatchPredictions,
        checkpointList,

        currentCheckpoint,
        dispatchCurrentCheckpoint,

        selectedModel,
        setSelectedModel,

        updateProjectName,
        updateCheckpointName,

        dispatchAoiPatch,
      }}
    >
      {props.children}
    </ExploreContext.Provider>
  );
}

ExploreProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
export const useExploreContext = (fnName) => {
  const context = useContext(ExploreContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ExploreContext> component's context.`
    );
  }

  return context;
};

export const useMapState = () => {
  const { mapState, dispatchMapState } = useExploreContext('useMapState');

  const setMapMode = (mode) =>
    dispatchMapState({
      type: mapActionTypes.SET_MODE,
      data: mode,
    });

  return useMemo(
    () => ({
      mapState,
      setMapMode,
      mapModes,
    }),
    [mapState, mapModes]
  );
};
