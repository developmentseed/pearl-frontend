import React, { createContext, useContext, useMemo, useReducer } from 'react';
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import differenceWith from 'lodash.differencewith';
import T from 'prop-types';

import { wrapLogReducer } from './reducers/utils';

const CheckpointContext = createContext(null);

export const checkpointModes = {
  RUN: 'RUN',
  RETRAIN: 'RETRAIN',
  REFINE: 'REFINE',
};

export const actions = {
  SET_CHECKPOINT: 'SET_CHECKPOINT',
  SET_CHECKPOINT_NAME: 'SET_CHECKPOINT_NAME',
  SET_CHECKPOINT_MODE: 'SET_CHECKPOINT_MODE',
  ADD_CHECKPOINT_BRUSH: 'ADD_CHECKPOINT_BRUSH',
  RECEIVE_METADATA: 'RECEIVE_METADATA',
  RECEIVE_AOI_INFO: 'RECEIVE_AOI_INFO',
  RECEIVE_ANALYTICS: 'RECEIVE_ANALYTICS',
  SET_ACTIVE_CLASS: 'SET_ACTIVE_CLASS',
  ADD_POINT_SAMPLE: 'ADD_POINT_SAMPLE',
  REMOVE_POINT_SAMPLE: 'REMOVE_POINT_SAMPLE',
  CLEAR_SAMPLES: 'CLEAR_SAMPLES',
  RESET_CHECKPOINT: 'RESET_CHECKPOINT',
  UPDATE_POLYGONS: 'UPDATE_POLYGONS',
  INPUT_UNDO: 'INPUT_UNDO',
};

export function CheckpointProvider(props) {
  const [currentCheckpoint, dispatchCurrentCheckpoint] = useReducer(
    wrapLogReducer(checkpointReducer)
  );

  const value = {
    currentCheckpoint,
    dispatchCurrentCheckpoint,
  };

  return (
    <CheckpointContext.Provider value={value}>
      {props.children}
    </CheckpointContext.Provider>
  );
}

CheckpointProvider.propTypes = {
  children: T.node,
};

function checkpointReducer(state, action) {
  switch (action.type) {
    case actions.SET_CHECKPOINT:
      // Action used to load existing or initialize a new checkpoint
      return {
        ...action.data,
        mode: action.data.mode || checkpointModes.RUN,
        retrain_geoms: action.data.retrain_geoms,
        input_geoms: action.data.input_geoms,
        activeItem: action.data.classes
          ? action.data.classes[0].name
          : undefined,
        classes: action.data.classes
          ? action.data.classes.reduce((acc, c) => {
              acc[c.name] = {
                ...c,
                points: {
                  type: 'MultiPoint',
                  coordinates: [],
                },
                polygons: [],
              };
              return acc;
            }, {})
          : state.classes || {},
        // Polygon brush samples. User defined regions
        // with which to run inference using arbitrary checkpoint
        // that exists under the current project
        checkpointBrushes: {},

        // User action history of classes and checkpoint brushes
        history: [],
      };
    case actions.SET_CHECKPOINT_NAME:
      return {
        ...state,
        ...action.data,
      };
    case actions.SET_CHECKPOINT_MODE:
      return {
        ...state,
        ...action.data,
      };

    case actions.ADD_CHECKPOINT_BRUSH:
      return {
        ...state,
        checkpointBrushes: {
          ...state.checkpointBrushes,
          [action.data.id]: {
            checkpoint: action.data.checkpoint,
            polygons: [],
          },
        },
      };
    case actions.RECEIVE_AOI_INFO:
      return {
        ...state,
        ...action.data,
        checkpointBrushes: {},
        classes: Object.values(state.classes).reduce((accum, c) => {
          return {
            ...accum,
            [c.name]: {
              ...c,
              points: {
                type: 'MultiPoint',
                coordinates: [],
              },
              polygons: [],
            },
          };
        }, {}),
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
    case actions.UPDATE_POLYGONS:
      if (action.data.isCheckpointPolygon) {
        return {
          ...state,
          history: [
            ...state.history,
            {
              classes: state.classes,
              checkpointBrushes: state.checkpointBrushes,
            },
          ],
          checkpointBrushes: {
            [action.data.name]: {
              ...state.checkpointBrushes[action.data.name],
              polygons: action.data.polygons,
            },
          },
        };
      } else {
        return {
          ...state,
          history: [
            ...state.history,
            {
              classes: state.classes,
              checkpointBrushes: state.checkpointBrushes,
            },
          ],
          classes: {
            ...state.classes,
            [action.data.name]: {
              ...state.classes[action.data.name],
              polygons: action.data.polygons,
            },
          },
        };
      }
    case actions.SET_ACTIVE_CLASS:
      return {
        ...state,
        activeItem: action.data,
      };
    case actions.ADD_POINT_SAMPLE: {
      // Get coords
      const { lat, lng } = action.data;

      // Merge coords into class
      const currentClass = state.classes[state.activeItem];
      const updatedClass = {
        ...currentClass,
        points: {
          ...currentClass.points,
          coordinates: uniqWith(
            currentClass.points.coordinates.concat([[lng, lat]]),
            isEqual
          ),
        },
      };
      // Return with updated class
      return {
        ...state,
        history: [
          ...state.history,
          {
            classes: state.classes,
            checkpointBrushes: state.checkpointBrushes,
          },
        ],
        classes: {
          ...state.classes,
          [state.activeItem]: updatedClass,
        },
      };
    }
    case actions.REMOVE_POINT_SAMPLE: {
      // Get coords
      const { lat, lng } = action.data;

      // Merge coords into class
      const currentClass = state.classes[state.activeItem];
      const updatedClass = {
        ...currentClass,
        points: {
          ...currentClass.geometry,
          coordinates: differenceWith(
            currentClass.points.coordinates,
            [[lat, lng]],
            isEqual
          ),
        },
      };

      // Return with updated class
      return {
        ...state,
        history: [
          ...state.history,
          {
            classes: state.classes,
            checkpointBrushes: state.checkpointBrushes,
          },
        ],

        classes: {
          ...state.classes,
          [state.activeItem]: updatedClass,
        },
      };
    }

    case actions.CLEAR_SAMPLES: {
      return {
        ...state,
        history: [
          ...state.history,
          {
            classes: state.classes,
            checkpointBrushes: state.checkpointBrushes,
          },
        ],

        classes: Object.values(state.classes).reduce((accum, c) => {
          return {
            ...accum,
            [c.name]: {
              ...c,
              points: {
                type: 'MultiPoint',
                coordinates: [],
              },
              polygons: [],
            },
          };
        }, {}),
      };
    }

    case actions.INPUT_UNDO: {
      // Pop history and set input from element
      const latest = state.history[state.history.length - 1];

      if (!latest) return state;

      return {
        ...state,
        ...latest,
        history: state.history.slice(0, -1),
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

export const useCheckpoint = () => {
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckContext(
    'useCheckpoint'
  );

  return useMemo(
    () => ({
      currentCheckpoint,
      dispatchCurrentCheckpoint,
    }),
    [currentCheckpoint, dispatchCurrentCheckpoint]
  );
};
