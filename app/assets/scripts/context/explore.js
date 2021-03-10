import React, { createContext, useState, useEffect, useReducer } from 'react';
import T from 'prop-types';
import usePrevious from '../utils/use-previous';
import { initialApiRequestState } from '../reducers/reduxeed';
import { createApiMetaReducer, queryApiMeta } from '../reducers/api';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import toasts from '../components/common/toasts';
import { useHistory } from 'react-router-dom';
import WebsocketClient from './websocket-client';
import useLocalstorage from '@rooks/use-localstorage';

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
  const [map, setMap] = useState(null);
  const [aoiRef, setAoiRef] = useState(null);
  const [aoiArea, setAoiArea] = useState(null);
  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);
  const previousViewMode = usePrevious(viewMode);
  const [prediction, setPrediction] = useState();
  const [currentInstance, setCurrentInstance] = useLocalstorage(null);
  const [websocketClient, setWebsocketClient] = useState(null);

  const [apiMeta, dispatchApiMeta] = useReducer(
    createApiMetaReducer,
    initialApiRequestState
  );

  // On mount, fetch API metadata
  useEffect(() => {
    showGlobalLoadingMessage('Checking API status...');
    queryApiMeta()(dispatchApiMeta);
  }, []);

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

  useEffect(() => {
    if (currentInstance) {
      initWebsocket();
    }
  }, []);

  function initWebsocket() {
    console.log('initWebsocket')
    // Create new websocket
    const newWebsocketClient = new WebsocketClient(currentInstance.token);
    newWebsocketClient.addEventListener('open', (event) => {
      console.log(event.data);
    });
    newWebsocketClient.addEventListener('message', (event) => {
      console.log('message');
      console.log(event.data);
    });
    setWebsocketClient(newWebsocketClient);
  }

  function requestPrediction() {
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

    // Send request prediction message
    websocketClient.send(
      JSON.stringify({
        action: 'model#prediction',
        data: {
          name: 'Seneca Rocks, WV',
          polygon: aoiPolygon,
        },
      })
    );
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
        requestPrediction,
      }}
    >
      {props.children}
    </ExploreContext.Provider>
  );
}

ExploreProvider.propTypes = {
  children: T.node,
};
