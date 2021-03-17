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
  const [checkpointList, setCheckpointList] = useState(null);

  // Selected checkpoint is a checkpoint object
  // Should contain a name and id when set
  const [selectedCheckpoint, setSelectedCheckpoint] = useState({});

  // Reference to Leaflet Rectangle layer created by
  // AOI draw control
  const [aoiRef, setAoiRef] = useState(null);

  // Float value that records square area of aoi
  const [aoiArea, setAoiArea] = useState(null);

  // Aoi shape that is requested from API. used to initialize
  // Leaflet layer in the front end
  // eslint-disable-next-line
  const [aoiInitializer, setAoiInitializer] = useState(null);

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

  async function loadProject() {
    if (projectId !== 'new') {
      showGlobalLoadingMessage('Loading project...');
      try {
        // Get project metadata
        const project = await restApiClient.getProject(projectId);

        setCurrentProject(project);

        const model = await restApiClient.getModel(project.model_id);

        setSelectedModel(model);

        const checkpoints = await restApiClient.getCheckpoints(projectId);
        if (checkpoints.total > 0) {
          // Save checkpoints if any exist, else leave as null
          setCheckpointList(checkpoints);
        }

        /* TODO 
           * This code is untested.
           * Once inference is run on a project, the API will
           * return an AOI here
          const aois = await restApiClient.get(`project/${project.id}/aoi`);

          if (aois.total > 0) {
            const latest = aois.pop();
            setAoiInitializer(latest);
          }
          */
      } catch (error) {
        toasts.error('Error loading project, please try again later.');
      } finally {
        hideGlobalLoading();
      }
    }
  }

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
    if (restApiClient) {
      loadProject();
      //loadCheckpoints();
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
      if (predictions.error) {
        toasts.error('An inference error occurred, please try again later.');
      }
    }
  }, [predictions]);

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
              newWebsocketClient.requestPrediction('A name', aoiRef),
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
        websocketClient.requestPrediction('A name', aoiRef);
      }
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
        aoiInitializer,

        currentInstance,
        setCurrentInstance,

        currentProject,
        setCurrentProject,

        checkpointList,
        selectedCheckpoint,
        setSelectedCheckpoint,

        selectedModel,
        setSelectedModel,

        updateProjectName,
        availableClasses,
        runInference,
      }}
    >
      {props.children}
    </ExploreContext.Provider>
  );
}

ExploreProvider.propTypes = {
  children: T.node,
};
