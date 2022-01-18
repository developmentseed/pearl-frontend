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
  sessionModes,
  useSessionStatusReducer,
} from './session-status';

import {
  useShortcutReducer,
  listenForShortcuts,
  actions as shortcutActions,
} from './shortcuts';

export { sessionModes };
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
  useEffect(() => {
    // If this project is not new, make sure that site tour step is set to -1, we do not need to show the tour
    if (projectId !== 'new') {
      setTourStep(-1);
    }
  }, [projectId]);

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
  const {
    currentCheckpoint,
    dispatchCurrentCheckpoint,
    checkpointList,
    loadCheckpointList,
  } = useCheckpoint();
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
  const [currentInstance, setCurrentInstance] = useState(null);
  const {
    initInstance,
    loadAoiOnInstance,
    getRunningBatch,
    instanceType,
  } = useInstance();

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
    if (mode === sessionModes.SET_PROJECT_NAME && projectName) {
      isInitialized.current = true;
      setSessionStatusMode(sessionModes.SET_AOI);
    } else if (mode === sessionModes.SET_AOI && aoiRef) {
      setSessionStatusMode(sessionModes.SELECT_MODEL);
    } else if (mode === sessionModes.SELECT_MODEL && selectedModel) {
      setSessionStatusMode(sessionModes.PREDICTION_READY);
    } else if (
      mode === sessionModes.LOADING_PROJECT &&
      aoiRef &&
      currentCheckpoint
    ) {
      isInitialized.current = true;
      setSessionStatusMode(sessionModes.RETRAIN_READY);
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
      setSessionStatusMode(sessionModes.SET_PROJECT_NAME);
      hideGlobalLoading();
      return; // Bypass loading project when new
    } else {
      setSessionStatusMode(sessionModes.LOADING_PROJECT);
    }

    const { availableInstances } = await restApiClient.getApiMeta('');

    // Do not run when no instances are available
    if (!availableInstances[instanceType]) {
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
      await setSelectedModel(project.model_id);

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

      showGlobalLoadingMessage('Initializing instance...');
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

  // Load project meta on load and api client ready
  useEffect(() => {
    if (!authIsLoading && restApiClient && instanceType) {
      loadInitialData();
    }
  }, [authIsLoading, restApiClient, instanceType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (predictions.status === 'running') {
      const { processed, total, retrainProgress } = predictions;
      if (total) {
        setSessionStatusMessage(`Received image ${processed} of ${total}...`);
      } else if (retrainProgress >= 100) {
        setSessionStatusMessage(`Retrain finished...`);
      } else if (retrainProgress > 0) {
        setSessionStatusMessage(`${retrainProgress}% retrained...`);
      }
    } else if (predictions.isReady) {
      // Update AOI List with newest AOI
      // If predictions is ready, restApiClient must be ready

      if (predictions.data.predictions?.length > 0) {
        restApiClient.get(`project/${currentProject.id}/aoi/`).then((aois) => {
          setAoiList(aois.aois);
        });
        // Refresh checkpoint list, prediction finished
        // means new checkpoint available
        loadCheckpointList(currentProject.id);

        if (predictions.data.type === checkpointModes.RETRAIN) {
          loadMetrics();
        }

        restApiClient
          .get(`project/${currentProject.id}/aoi/${predictions.data.aoiId}`)
          .then((aoi) => {
            setCurrentAoi(aoi);
          });

        setSessionStatusMode(sessionModes.RETRAIN_READY);
        dispatchShortcutState({
          type: shortcutActions.SET_PREDICTION_OPACITY_100,
        });
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
        toasts.error('An error ocurred while requesting AOI patch.');
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
   * @param aoiObject - object containing AOI id and name
   *                  Objects of this format are returned by
   * @param aoiMatchesCheckpoint - bool
   *                  AOI listing endpoint
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
    let area;

    if (aoiRef) {
      // Load existing AOI that was returned by the api
      aoiRef.setBounds(bounds);
      setAoiBounds(aoiRef.getBounds());
      setAoiName(aoiObject.name);

      if (predictions.isReady) {
        dispatchPredictions({ type: predictionActions.CLEAR_PREDICTION });
      }
    } else {
      // initializing map with first AOI
      setAoiInitializer(bounds);
      setAoiName(aoiObject.name);
    }

    area = areaFromBounds(tBbox(aoi.bounds));
    setAoiArea(area);

    if (!aoiMatchesCheckpoint) {
      toasts.error(
        'Tiles do not exist for this AOI and this checkpoint. Treating as geometry only'
      );
      setAoiName(aoiObject.name);
      if (currentCheckpoint) {
        dispatchCurrentCheckpoint({
          type: checkpointActions.SET_CHECKPOINT_MODE,
          data: {
            mode: checkpointModes.RUN,
          },
        });
        setSessionStatusMode(sessionModes.PREDICTION_READY);
      }
      setCurrentAoi(null);
      hideGlobalLoading();
    } else {
      setCurrentAoi(aoi);

      // Only load AOI   on instance if storage is true
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

export const useAoiMeta = () => {
  const {
    aoiBounds,
    setAoiBounds,
    aoiArea,
    aoiList,
    loadAoi,
    createNewAoi,
  } = useExploreContext('useAoiMeta');

  return useMemo(
    () => ({
      aoiBounds,
      setAoiBounds,
      aoiArea,
      aoiList,

      loadAoi,
      createNewAoi,
    }),
    [aoiBounds, aoiArea, aoiList, loadAoi, createNewAoi]
  );
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
