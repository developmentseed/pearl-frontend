import React, {
  createContext,
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import T from 'prop-types';
import usePrevious from '../utils/use-previous';
import { initialApiRequestState } from '../reducers/reduxeed';
import { createApiMetaReducer } from '../reducers/api';
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
import logger from '../utils/logger';

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
  const [map, setMap] = useState(null);
  const [aoiRef, setAoiRef] = useState(null);
  const [aoiArea, setAoiArea] = useState(null);
  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);
  const [selectedModel, setSelectedModel] = useState(null);

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

  // Load project meta on load and api client ready
  useEffect(() => {
    async function loadProject() {
      if (projectId !== 'new') {
        showGlobalLoadingMessage('Loading project...');
        try {
          // Get project metadata
          const project = await restApiClient.getProject(projectId);
          setCurrentProject(project);
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
  }, [restApiClient]);

  // If API is unreachable, redirect to home
  useEffect(() => {
    if (!apiMeta.isReady()) return;

    hideGlobalLoading();
    if (apiMeta.hasError()) {
      toasts.error('API is unavailable, please try again later.');
      history.push('/');
    }
  }, [apiMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle instance changes
  useEffect(() => {
    if (currentInstance) {
      // Kill existing websocket if instance has changed
      if (websocketClient) {
        websocketClient.close();
      }

      // Create websocket
      const newWebsocketClient = new WebsocketClient({
        token: currentInstance.token,
        dispatchPredictions,
        onConnected: () => {
          logger('onConnected');
          // Get AOI bounds polygon
          const {
            _southWest: { lng: minX, lat: minY },
            _northEast: { lng: maxX, lat: maxY },
          } = aoiRef.getBounds();
          const aoiPolygon = {
            type: 'Polygon',
            coordinates: [
              [
                [minX, minY],
                [maxX, minY],
                [maxX, maxY],
                [minX, maxY],
                [minX, minY],
              ],
            ],
          };

          // Start prediction on connected
          newWebsocketClient.requestPrediction('A name', aoiPolygon);
        },
      });

      setWebsocketClient(newWebsocketClient);
    }
  }, [currentInstance]);

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
      if (websocketClient) {
        websocketClient.terminateInstance();
      }
    }
  }, [predictions]);

  return (
    <ExploreContext.Provider
      value={{
        map,
        setMap,
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
        currentInstance,
        setCurrentInstance,
        currentProject,
        setCurrentProject,
        selectedModel,
        setSelectedModel,
      }}
    >
      {props.children}
    </ExploreContext.Provider>
  );
}

ExploreProvider.propTypes = {
  children: T.node,
};
