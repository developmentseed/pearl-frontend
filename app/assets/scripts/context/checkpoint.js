import { useContext, useMemo } from 'react';
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import differenceWith from 'lodash.differencewith';
import { useRestApiClient } from './auth';
import { useProject, useMapState, ExploreContext } from './explore';

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

export function checkpointReducer(state, action) {
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
        retrain_geoms: action.data.retrain_geoms,
        input_geoms: action.data.input_geoms,
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
  const context = useContext(ExploreContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ExploreContext> component's context.`
    );
  }

  return context;
};

export const useCheckpoint = () => {
  const { setMapMode, mapModes } = useMapState();
  const { restApiClient } = useRestApiClient();
  const { currentProject, aoiRef, aoiName } = useProject();
  // const { sendWebsocketMessage } = useWebsocketClient();
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckContext(
    'useCheckpoint'
  );

  return useMemo(
    () => ({
      currentCheckpoint,
      dispatchCurrentCheckpoint,
    }),
    [
      aoiName,
      aoiRef,
      currentProject,
      restApiClient,
      // sendWebsocketMessage,
      currentCheckpoint,
      dispatchCurrentCheckpoint,
      setMapMode,
      mapModes,
    ]
  );
};
