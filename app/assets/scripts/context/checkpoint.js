import React, { createContext, useContext, useMemo, useReducer } from 'react';
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import differenceWith from 'lodash.differencewith';
import T from 'prop-types';
import { useAuth } from './auth';
import toasts from '../components/common/toasts';
import logger from '../utils/logger';

import { wrapLogReducer } from './reducers/utils';

const CheckpointContext = createContext(null);

export const checkpointModes = {
  RUN: 'RUN',
  RETRAIN: 'RETRAIN',
  REFINE: 'REFINE',
};

export const actions = {
  ADD_CLASS: 'ADD_CLASS',
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

  SET_AOI_CHECKED: 'SET_AOI_CHECKED',
};

export function CheckpointProvider(props) {
  const [currentCheckpoint, dispatchCurrentCheckpoint] = useReducer(
    wrapLogReducer(checkpointReducer)
  );

  const { restApiClient } = useAuth();

  /*
   * @param created - if new checkpoint was just created,don't to verify that aoi matches
  */
  async function fetchCheckpoint(projectId, checkpointId, mode, noCheck) {
    try {
      const checkpoint = await restApiClient.getCheckpoint(
        projectId,
        checkpointId
      );
      let _data = {};

      if (mode) {
        // Function is used from applyCheckpoint context
        _data.mode =
          mode || (currentCheckpoint && currentCheckpoint.mode) || null;
      } else {
        _data.analytics = null;
      }

      _data.checkAoi = noCheck ? false : true;
      dispatchCurrentCheckpoint({
        type: actions.SET_CHECKPOINT,
        data: {
          ...checkpoint,
          ..._data,
          //mode: checkpointModes.RETRAIN
        },
      });
    } catch (error) {
      logger(error);
      toasts.error('Could not fetch checkpoint.');
    }
  }

  const value = {
    currentCheckpoint,
    dispatchCurrentCheckpoint,
    fetchCheckpoint,
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
        name:
          state && state.mode === checkpointModes.RUN
            ? state.name
            : action.data.name,
        checkAoi: action.data.checkAoi || false,
        bookmarked:
          action.data.bookmarked !== undefined
            ? action.data.bookmarked
            : (state && state.bookmarked) || false,
        analytics: action.data.analytics || (state && state.analytics) || null,
        mode: action.data.mode || (state && state.mode) || checkpointModes.RUN,
        retrain_geoms:
          action.data.retrain_geoms || (state && state.retrain_geoms) || null,
        input_geoms:
          action.data.input_geoms || (state && state.input_geoms) || null,
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

    case actions.SET_AOI_CHECKED:
      return {
        ...state,
        checkAoi: action.data.checkAoi,
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

    // Modifies current checkpoint classes to add a custom user defined class
    case actions.ADD_CLASS: {
      const newClass = {
        name: action.data.name,
        color: action.data.color,
        points: {
          type: 'MultiPoint',
          coordinates: [],
        },
        polygons: [],
      };
      return {
        ...state,
        classes: {
          ...state.classes,
          [newClass.name]: newClass,
        },
      };
    }

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
            ...state.checkpointBrushes,
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
        // Clear history when samples are cleared
        // If we retain history we can get into a complicated situation
        // In which brush samples might be restored while in retrain mode
        history: [],
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
  const {
    currentCheckpoint,
    dispatchCurrentCheckpoint,
    fetchCheckpoint,
  } = useCheckContext('useCheckpoint');

  return useMemo(
    () => ({
      currentCheckpoint,
      dispatchCurrentCheckpoint,
      fetchCheckpoint,
    }),
    [currentCheckpoint, dispatchCurrentCheckpoint, fetchCheckpoint]
  );
};
