import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useContext,
  useMemo,
  useRef,
} from 'react';
import T from 'prop-types';
import { useAuth } from '../auth';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../components/common/global-loading';
import { areaFromBounds } from '../../utils/map';
import toasts from '../../components/common/toasts';
import { useHistory, useParams } from 'react-router-dom';
import { actions as predictionActions, usePredictions } from '../predictions';
import { mapStateReducer, mapModes, mapActionTypes } from '../reducers/map';
import tBbox from '@turf/bbox';

import {
  actions as checkpointActions,
  checkpointModes,
  useCheckpoint,
} from '../checkpoint';
import { useAoi, useAoiPatch } from '../aoi';
import { actions as aoiPatchActions } from '../reducers/aoi_patch';
import { useProject } from '../project';
import { useModel } from '../model';
import { useInstance } from '../instance';
import logger from '../../utils/logger';
import { wrapLogReducer } from '../reducers/utils';
import {
  actions as sessionActions,
  useSessionStatusReducer,
} from './session-status';

import { useShortcutReducer, listenForShortcuts } from './shortcuts';

/**
 * Context & Provider
 */
export const ExploreContext = createContext(null);

export function ExploreProvider(props) {
  const history = useHistory();
  let { projectId } = useParams();

  const isInitialized = useRef(false);

  const [tourStep, setTourStep] = useState(
    localStorage.getItem('site-tour')
      ? Number(localStorage.getItem('site-tour'))
      : null
  );

  useEffect(() => {
    localStorage.setItem('site-tour', tourStep);
  }, [tourStep]);

  const { restApiClient, isLoading: authIsLoading } = useAuth();
  const {
    currentProject,
    setCurrentProject,
    projectName,
    setProjectName,
  } = useProject();
  const {
    aoiName,
    aoiRef,
    setAoiName,
    setAoiRef,
    currentAoi,
    setCurrentAoi,
    aoiList,
    setAoiList,
    aoiBounds,
    setAoiBounds,

    aoiArea,
    setAoiArea,
  } = useAoi();
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
  const [aoiInitializer, setAoiInitializer] = useState(null);

  const [mapState, dispatchMapState] = useReducer(
    wrapLogReducer(mapStateReducer),
    {
      mode: mapModes.BROWSE_MODE,
    }
  );
  const [checkpointList, setCheckpointList] = useState(null);
  const [currentInstance, setCurrentInstance] = useState(null);
  const { initInstance, loadAoiOnInstance, getRunningBatch } = useInstance();

  /**
   * Session status
   */
  const [sessionStatus, dispatchSessionStatus] = useSessionStatusReducer();

  /*
   * Keyboard shortcuts
   */
  const [shortcutState, dispatchShortcutState] = useShortcutReducer();

  // Action handlers
  const setSessionStatusMessage = (message) =>
    dispatchSessionStatus({
      type: sessionActions.SET_MESSAGE,
      data: message,
    });
  const setSessionStatusMode = (mode) =>
    dispatchSessionStatus({
      type: sessionActions.SET_MODE,
      data: mode,
    });

  // Handle session mode updates
  useEffect(() => {
    const { mode } = sessionStatus;
    if (mode === 'set-project-name' && projectName) {
      isInitialized.current = true;
      setSessionStatusMode('set-aoi');
    } else if (mode === 'set-aoi' && aoiRef) {
      setSessionStatusMode('select-model');
    } else if (mode === 'select-model' && selectedModel) {
      setSessionStatusMode('prediction-ready');
    } else if (mode === 'loading-project' && aoiRef && currentCheckpoint) {
      isInitialized.current = true;
      setSessionStatusMode('retrain-ready');
    }
  }, [
    sessionStatus.mode,
    projectName,
    aoiRef,
    selectedModel,
    currentCheckpoint,
  ]);

  useEffect(() => {
    if (isInitialized.current) {
      const wrappedFunc = (e) => listenForShortcuts(e, dispatchShortcutState);

      document.addEventListener('keydown', wrappedFunc);
      document.addEventListener('keyup', wrappedFunc);

      return () => {
        document.removeEventListener('keydown', wrappedFunc);
        document.removeEventListener('keyup', wrappedFunc);
      };
    }
  }, [isInitialized.current, dispatchShortcutState]);

  async function loadInitialData() {
    showGlobalLoadingMessage('Loading configuration...');

    // Update session status
    if (projectId === 'new') {
      setSessionStatusMode('set-project-name');
      hideGlobalLoading();
      return; // Bypass loading project when new
    } else {
      setSessionStatusMode('loading-project');
    }

    const { availableGpus } = await restApiClient.getApiMeta('');

    // Do not run when no instances are available
    if (!availableGpus) {
      hideGlobalLoading();
      toasts.error('No instances available, please try again later.', {
        autoClose: false,
        toastId: 'no-instance-available-error',
      });
      history.push(`/profile/projects/${projectId}`);
      return;
    }

    let project;
    try {
      // Get project metadata
      showGlobalLoadingMessage('Fetching project metadata...');
      project = await restApiClient.getProject(projectId);
      setCurrentProject(project);
      setProjectName(project.name);
      getRunningBatch(project);
    } catch (error) {
      hideGlobalLoading();
      logger(error);
      toasts.error('Project not found.');
      history.push('/profile/projects');
      return;
    }

    try {
      showGlobalLoadingMessage('Fetching model...');
      const model = await restApiClient.getModel(project.model_id);
      setSelectedModel(model);

      showGlobalLoadingMessage('Fetching areas of interest...');
      const aoiReq = await restApiClient.get(`project/${project.id}/aoi`);
      const aois = aoiReq.aois;

      setAoiList(aois);

      showGlobalLoadingMessage('Fetching checkpoints...');
      const { checkpoints } = await loadCheckpointList(projectId);
      const checkpoint = checkpoints[0];
      let latestAoi;
      if (aoiReq.total > 0) {
        latestAoi = aois.find((a) => Number(a.checkpoint_id) === checkpoint.id);
      }

      showGlobalLoadingMessage('Looking for active GPU instances...');
      const instance = await initInstance(
        project.id,
        checkpoint && checkpoint.id,
        latestAoi && latestAoi.id
      );

      loadAoi(project, latestAoi, true, true);

      setCurrentInstance(instance);
    } catch (error) {
      logger(error);
      toasts.error('Error loading project, please try again later.');
    }
  }

  async function loadCheckpointList(projectId) {
    const checkpointsMeta = await restApiClient.getCheckpoints(projectId);
    if (checkpointsMeta.total > 0) {
      // Save checkpoints if any exist, else leave as null
      // Only keep book marked and root checkpoints
      const list = checkpointsMeta.checkpoints.filter(
        (ckpt) => !ckpt.parent || ckpt.bookmarked
      );

      setCheckpointList(list);
      return {
        checkpoints: list,
      };
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
        setSessionStatusMessage(`Waiting for predictions...`);
      } else {
        setSessionStatusMessage(`Received image ${processed} of ${total}...`);
      }
    } else if (predictions.isReady()) {
      // Update aoi List with newest aoi
      // If predictions is ready, restApiClient must be ready

      if (predictions.fetched && predictions.data.predictions?.length > 0) {
        restApiClient.get(`project/${currentProject.id}/aoi/`).then((aois) => {
          setAoiList(aois.aois);
        });
        // Refresh checkpoint list, prediction finished
        // means new checkpoint available
        loadCheckpointList(currentProject.id);

        if (predictions.getData().type === checkpointModes.RETRAIN) {
          loadMetrics();
        }

        restApiClient
          .get(
            `project/${currentProject.id}/aoi/${predictions.getData().aoiId}`
          )
          .then((aoi) => {
            setCurrentAoi(aoi);
          });

        setSessionStatusMode('retrain-ready');
      }

      if (predictions.error) {
        toasts.error('An inference error occurred, please try again later.');
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
          currentAoi.id,
          updatedPatchList.map((p) => p.id)
        );
        dispatchAoiPatch({ type: aoiPatchActions.CLEAR_PATCH });
      } else if (aoiPatch.error) {
        toasts.error('An error ocurred while requesting aoi patch.');
        logger(aoiPatch.error);
      }
    }
  }, [aoiPatch, currentAoi, restApiClient, currentProject]);

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
    if (
      mapState.mode === mapModes.BROWSE_MODE &&
      mapState.previousMode === mapModes.EDIT_AOI_MODE
    ) {
      dispatchPredictions({ type: predictionActions.CLEAR_PREDICTION });
    }
  }, [mapState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    if (shortcutState.overrideBrowseMode) {
      dispatchMapState({
        type: mapActionTypes.SET_MODE,
        data: mapModes.BROWSE_MODE,
      });
    } else if (mapState.previousMode) {
      dispatchMapState({
        type: mapActionTypes.SET_MODE,
        data: mapState.previousMode,
      });
    }
  }, [isInitialized.current, shortcutState.overrideBrowseMode]);

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

    setCurrentAoi(null);

    //clear inference tiles
    dispatchPredictions({
      type: predictionActions.CLEAR_PREDICTION,
    });

    dispatchCurrentCheckpoint({
      type: checkpointActions.SET_CHECKPOINT_MODE,
      data: {
        mode: checkpointModes.RUN,
      },
    });
    dispatchCurrentCheckpoint({
      type: checkpointActions.CLEAR_SAMPLES,
    });
  }

  /*
   * When a checkpoint is changed
   */

  const checkId = currentCheckpoint ? currentCheckpoint.id : null;
  useEffect(() => {
    if (
      currentCheckpoint &&
      currentCheckpoint.id &&
      currentCheckpoint.checkAoi
    ) {
      const aoi = aoiList.find(
        (aoi) => Number(aoi.checkpoint_id) === Number(currentCheckpoint.id)
      );
      if (aoi) {
        loadAoi(currentProject, aoi, true);
      }
    }
  }, [aoiList, checkId]);

  /*
   * Utility function to load AOI
   * @param project - current project object
   * @param aoiObject - object containing aoi id and name
   *                  Objects of this format are returned by
   * @param aoiMatchesCheckpoint - bool
   *                  aoi listing endpoint
   */

  async function loadAoi(
    project,
    aoiObject,
    aoiMatchesCheckpoint,
    noLoadOnInst
  ) {
    if (!aoiObject) {
      return;
    }

    showGlobalLoadingMessage('Loading AOI');
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

      if (predictions.isReady) {
        dispatchPredictions({ type: predictionActions.CLEAR_PREDICTION });
      }
    } else {
      // initializing map with first aoi
      setAoiInitializer(bounds);
      setAoiName(aoiObject.name);
    }

    setAoiArea(areaFromBounds(tBbox(aoi.bounds)));

    if (!aoiMatchesCheckpoint) {
      toasts.error(
        'Tiles do not exist for this aoi and this checkpoint. Treating as geometry only'
      );
      if (currentCheckpoint) {
        dispatchCurrentCheckpoint({
          type: checkpointActions.SET_CHECKPOINT_MODE,
          data: {
            mode: checkpointModes.RUN,
          },
        });
      }
      setCurrentAoi(null);
      hideGlobalLoading();
    } else {
      setCurrentAoi(aoi);

      // Only load aoi on instance if storage is true
      if (currentInstance && !noLoadOnInst && aoiObject.storage) {
        loadAoiOnInstance(aoi.id);
      } else {
        hideGlobalLoading();
      }

      if (currentCheckpoint) {
        dispatchCurrentCheckpoint({
          type: checkpointActions.SET_CHECKPOINT_MODE,
          data: {
            mode: checkpointModes.RETRAIN,
          },
        });

        dispatchCurrentCheckpoint({
          type: checkpointActions.CLEAR_SAMPLES,
        });

        dispatchMapState({
          type: mapActionTypes.SET_MODE,
          data: mapModes.ADD_CLASS_SAMPLES,
        });
      }
    }

    dispatchCurrentCheckpoint({
      type: checkpointActions.SET_AOI_CHECKED,
      data: {
        checkAoi: false,
      },
    });

    return bounds;
  }

  async function updateProjectName(name) {
    if (restApiClient) {
      let project;
      if (!currentProject) {
        toasts.error('Project does not exist yet');
      } else {
        try {
          project = await restApiClient.patch(`project/${currentProject.id}`, {
            name,
          });
          setCurrentProject(project);
          toasts.success('Project name updated');
        } catch (err) {
          toasts.error('Could not update project name');
        }
      }
    }
  }

  async function createProject() {
    if (restApiClient) {
      let project;
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
          bookmarked: true,
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

  return (
    <ExploreContext.Provider
      value={{
        tourStep,
        setTourStep,

        projectId,
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
        createProject,
        updateCheckpointName,

        dispatchAoiPatch,

        sessionStatus,
        setSessionStatusMode,

        shortcutState,
        dispatchShortcutState,
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

export const useSessionStatus = () => {
  const { sessionStatus, setSessionStatusMode } = useExploreContext(
    'useSessionStatus'
  );

  return useMemo(() => ({ sessionStatus, setSessionStatusMode }), [
    sessionStatus,
  ]);
};

export const useShortcutState = () => {
  const { shortcutState, dispatchShortcutState } = useExploreContext(
    'useSessionStatus'
  );

  return useMemo(
    () => ({
      shortcutState,
      dispatchShortcutState,
    }),
    [shortcutState, dispatchShortcutState]
  );
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

export const useProjectId = () => {
  const { projectId } = useExploreContext('useProjectId');

  return useMemo(
    () => ({
      projectId,
    }),
    [projectId]
  );
};

export const useTour = () => {
  const { tourStep, setTourStep } = useExploreContext('useTour');

  return useMemo(
    () => ({
      setTourStep,
      tourStep,
    }),
    [setTourStep, tourStep]
  );
};
