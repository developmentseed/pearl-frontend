import React, { createContext, useContext, useMemo, useReducer } from 'react';
import T from 'prop-types';
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import differenceWith from 'lodash.differencewith';
import { useRestApiClient } from './auth';
import { useWebsocketClient } from './explore';
import toasts from '../components/common/toasts';
import logger from '../utils/logger';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';

export const CheckpointContext = createContext({});

export function CheckpointProvider(props) {
  const [currentCheckpoint, dispatchCurrentCheckpoint] = useReducer(
    checkpointReducer
  );

  return (
    <CheckpointContext.Provider
      value={{
        currentCheckpoint,
        dispatchCurrentCheckpoint,
      }}
    >
      {props.children}
    </CheckpointContext.Provider>
  );
}

CheckpointProvider.propTypes = {
  children: T.node,
};

export const actions = {
  SET_CHECKPOINT: 'SET_CHECKPOINT',
  SET_CHECKPOINT_NAME: 'SET_CHECKPOINT_NAME',
  RECEIVE_METADATA: 'RECEIVE_METADATA',
  RECEIVE_AOI_INFO: 'RECEIVE_AOI_INFO',
  RECEIVE_ANALYTICS: 'RECEIVE_ANALYTICS',
  SET_ACTIVE_CLASS: 'SET_ACTIVE_CLASS',
  ADD_POINT_SAMPLE: 'ADD_POINT_SAMPLE',
  REMOVE_POINT_SAMPLE: 'REMOVE_POINT_SAMPLE',
  RESET_CHECKPOINT: 'RESET_CHECKPOINT',
};

function checkpointReducer(state, action) {
  switch (action.type) {
    case actions.SET_CHECKPOINT:
      return {
        ...action.data,
        activeClass: action.data.classes[0].name,
        classes: action.data.classes.reduce((acc, c) => {
          acc[c.name] = {
            ...c,
            geometry: {
              type: 'MultiPoint',
              coordinates: [],
            },
          };
          return acc;
        }, {}),
      };
    case actions.SET_CHECKPOINT_NAME:
      return {
        ...state,
        ...action.data,
      };
    case actions.RECEIVE_AOI_INFO:
      return {
        ...state,
        ...action.data,
      };
    case actions.RECEIVE_METRICS:
      return state;
    case actions.RECEIVE_ANALYTICS:
      return {
        ...state,
        ...action.data,
      };
    case actions.RECEIVE_METADATA:
      return {
        ...state,
        ...action.data,
      };
    case actions.SET_ACTIVE_CLASS:
      return {
        ...state,
        activeClass: action.data,
      };
    case actions.ADD_POINT_SAMPLE: {
      // Get coords
      const { lat, lng } = action.data;

      // Merge coords into class
      const currentClass = state.classes[state.activeClass];
      const updatedClass = {
        ...currentClass,
        geometry: {
          ...currentClass.geometry,
          coordinates: uniqWith(
            currentClass.geometry.coordinates.concat([[lng, lat]]),
            isEqual
          ),
        },
      };
      // Return with updated class
      return {
        ...state,
        classes: {
          ...state.classes,
          [state.activeClass]: updatedClass,
        },
      };
    }
    case actions.REMOVE_POINT_SAMPLE: {
      // Get coords
      const { lat, lng } = action.data;

      // Merge coords into class
      const currentClass = state.classes[state.activeClass];
      const updatedClass = {
        ...currentClass,
        geometry: {
          ...currentClass.geometry,
          coordinates: differenceWith(
            currentClass.geometry.coordinates,
            [[lat, lng]],
            isEqual
          ),
        },
      };

      // Return with updated class
      return {
        ...state,
        classes: {
          ...state.classes,
          [state.activeClass]: updatedClass,
        },
      };
    }
    case actions.RESET_CHECKPOINT: {
      return;
    }
    default:
      throw new Error('Unexpected error.');
  }
}

// Check if consumer function is used properly
const useCheckContext = (fnName) => {
  const context = useContext(CheckpointContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <CheckpointContext> component's context.`
    );
  }

  return context;
};

// Expose current checkpoint to consumer. This should be preferable way of consuming
// a single checkpoint, by avoiding using useContext(CheckpointContext) directly.
export const useCheckpoint = () => {
  const { restApiClient } = useRestApiClient();
  const { sendWebsocketMessage } = useWebsocketClient();
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckContext(
    'useCheckpoint'
  );

  return useMemo(
    () => ({
      currentCheckpoint,
      applyCheckpoint: async (projectId, checkpointId) => {
        try {
          showGlobalLoadingMessage('Applying checkpoint...');
          const checkpoint = await restApiClient.getCheckpoint(
            projectId,
            checkpointId
          );

          dispatchCurrentCheckpoint({
            type: actions.SET_CHECKPOINT,
            data: checkpoint,
          });

          sendWebsocketMessage({
            action: 'model#checkpoint',
            data: {
              id: checkpointId,
            },
          });

          hideGlobalLoading();
        } catch (error) {
          logger(error);
          toasts.error(
            'Could not load checkpoint meta, please try again later.'
          );
        }
      },
    }),
    [
      restApiClient,
      sendWebsocketMessage,
      currentCheckpoint,
      dispatchCurrentCheckpoint,
    ]
  );
};
