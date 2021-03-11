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
import { createApiMetaReducer, queryApiMeta } from '../reducers/api';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import toasts from '../components/common/toasts';
import { useHistory, useParams } from 'react-router-dom';
import WebsocketClient from './websocket-client';
import useLocalstorage from '@rooks/use-localstorage';
import GlobalContext from './global';

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
  const [prediction, setPrediction] = useState();
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
      initWebsocket();
    }
  }, [currentInstance]);

  function initWebsocket() {
    console.log('initWebsocket');
    console.log(currentInstance);
    // Create new websocket
    const newWebsocketClient = new WebsocketClient(currentInstance.token);
    newWebsocketClient.addEventListener('message', (event) => {
      console.log('message');
      console.log(event);

      if (!event.data) return;
      const eventData = JSON.parse(event.data);

      // On connected, request a prediction
      if (eventData.message === 'info#connected') {
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

        const message = {
          action: 'model#prediction',
          data: {
            polygon: aoiPolygon,
          },
        };

        console.log(message);
        newWebsocketClient.send(JSON.stringify(message));

        // On prediction received, update the map
      } else if (eventData.message === 'model#prediction') {
        const [minX, minY, maxX, maxY] = eventData.data.bounds;
        const predictionObj = {
          image: `data:image/png;base64,${eventData.data.image}`,
          bounds: [
            [minY, minX],
            [maxY, maxX],
          ],
        };
        console.log(predictionObj);
        setPrediction({
          image: `data:image/png;base64,${eventData.data.image}`,
          bounds: [
            [minY, minX],
            [maxY, maxX],
          ],
        });
      }
    });
    setWebsocketClient(newWebsocketClient);
  }

  return (
    <ExploreContext.Provider
      value={{
        map,
        setMap,
        prediction,
        setPrediction,
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
