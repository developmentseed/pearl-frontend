import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import differenceWith from 'lodash.differencewith';
import T from 'prop-types';
import { useAuth } from './auth';
import toasts from '../components/common/toasts';
import logger from '../utils/logger';
import { filterObject } from '../utils/utils';

import { wrapLogReducer } from './reducers/utils';

const CheckpointContext = createContext(null);

export const checkpointModes = {
  RUN: 'RUN',
  RETRAIN: 'RETRAIN',
  REFINE: 'REFINE',
};

export const actions = {
  ADD_CLASS: 'ADD_CLASS',
  EDIT_CLASS: 'EDIT_CLASS',
  RECEIVE_CHECKPOINT: 'RECEIVE_CHECKPOINT',
  SET_CHECKPOINT_NAME: 'SET_CHECKPOINT_NAME',
  SET_CHECKPOINT_MODE: 'SET_CHECKPOINT_MODE',
  ADD_CHECKPOINT_BRUSH: 'ADD_CHECKPOINT_BRUSH',
  RECEIVE_METADATA: 'RECEIVE_METADATA',
  RECEIVE_AOI_INFO: 'RECEIVE_AOI_INFO',
  RECEIVE_ANALYTICS: 'RECEIVE_ANALYTICS',
  SET_ACTIVE_CLASS: 'SET_ACTIVE_CLASS',
  ADD_POINT_SAMPLES: 'ADD_POINT_SAMPLES',
  REMOVE_POINT_SAMPLE: 'REMOVE_POINT_SAMPLE',
  CLEAR_SAMPLES: 'CLEAR_SAMPLES',
  RESET_CHECKPOINT: 'RESET_CHECKPOINT',
  UPDATE_POLYGONS: 'UPDATE_POLYGONS',
  ADD_CLASS_SAMPLES: 'ADD_CLASS_SAMPLES',
  INPUT_UNDO: 'INPUT_UNDO',
  SET_AOI_CHECKED: 'SET_AOI_CHECKED',
};

export function CheckpointProvider(props) {
  const [currentCheckpoint, dispatchCurrentCheckpoint] = useReducer(
    wrapLogReducer(checkpointReducer)
  );

  const { restApiClient } = useAuth();
  const [checkpointList, setCheckpointList] = useState(null);

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

  /*
   * @param created - if new checkpoint was just created,don't to verify that AOI matches
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
        type: actions.RECEIVE_CHECKPOINT,
        data: {
          ...checkpoint,
          ..._data,
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
    checkpointList,
    setCheckpointList,
    loadCheckpointList,
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
  let nextState;

  switch (action.type) {
    case actions.RECEIVE_CHECKPOINT:
      // Action used to load existing or initialize a new checkpoint
      nextState = {
        ...action.data,
        project_id: action.data.project_id || (state && state.project_id),
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
      break;
    case actions.SET_AOI_CHECKED:
      nextState = {
        ...state,
        checkAoi: action.data.checkAoi,
      };
      break;
    case actions.SET_CHECKPOINT_NAME:
      nextState = {
        ...state,
        ...action.data,
      };
      break;
    case actions.SET_CHECKPOINT_MODE:
      nextState = {
        ...state,
        ...action.data,
      };
      break;
    // Modifies current checkpoint classes to add a custom user defined class
    case actions.ADD_CLASS:
      {
        const newClass = {
          name: action.data.name,
          color: action.data.color,
          points: {
            type: 'MultiPoint',
            coordinates: [],
          },
          polygons: [],
        };
        nextState = {
          ...state,
          classes: {
            ...state.classes,
            [newClass.name]: newClass,
          },
        };
      }
      break;
    case actions.EDIT_CLASS:
      {
        const newClass = state.classes[action.data.oldName];
        newClass.name = action.data.name;
        newClass.color = action.data.color;
        const classes = filterObject(
          state.classes,
          (k) => k !== action.data.oldName
        );
        classes[newClass.name] = newClass;
        nextState = {
          ...state,
          classes: classes,
        };
      }
      break;
    case actions.ADD_CHECKPOINT_BRUSH:
      nextState = {
        ...state,
        checkpointBrushes: {
          ...state.checkpointBrushes,
          [action.data.id]: {
            checkpoint: action.data.checkpoint,
            polygons: [],
          },
        },
      };
      break;
    case actions.RECEIVE_AOI_INFO:
      nextState = {
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
      break;
    case actions.RECEIVE_METRICS:
      nextState = state;
      break;
    case actions.RECEIVE_ANALYTICS:
      nextState = {
        ...state,
        ...action.data,
      };
      break;
    case actions.RECEIVE_METADATA:
      nextState = {
        ...state,
        ...action.data,
      };
      break;
    case actions.UPDATE_POLYGONS:
      nextState = action.data.isCheckpointPolygon
        ? {
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
          }
        : {
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
      break;
    case actions.ADD_CLASS_SAMPLES:
      nextState = {
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
            points: {
              ...state.classes[state.activeItem].points,
              coordinates: uniqWith(
                state.classes[state.activeItem].points.coordinates.concat(
                  action.data.points
                ),
                isEqual
              ),
            },
          },
        },
      };
      break;
    case actions.SET_ACTIVE_CLASS:
      nextState = {
        ...state,
        activeItem: action.data,
      };
      break;
    case actions.ADD_POINT_SAMPLES: {
      // Merge coords into class
      const currentClass = state.classes[state.activeItem];
      const updatedClass = {
        ...currentClass,
        points: {
          ...currentClass.points,
          coordinates: uniqWith(
            currentClass.points.coordinates.concat(action.data),
            isEqual
          ),
        },
      };
      // Return with updated class
      nextState = {
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
      break;
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
      nextState = {
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
      break;
    }

    case actions.CLEAR_SAMPLES: {
      nextState = {
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
      break;
    }

    case actions.INPUT_UNDO: {
      // Pop history and set input from element
      const latest = state.history[state.history.length - 1];

      if (!latest) return state;

      nextState = {
        ...state,
        ...latest,
        history: state.history.slice(0, -1),
      };
      break;
    }
    case actions.RESET_CHECKPOINT: {
      break;
    }
    default:
      logger('Invalid action', action);
  }

  if (nextState && nextState.classes) {
    nextState.sampleCount = Object.values(nextState.classes).reduce(
      (count, c) => {
        /**
         * Check which format the point collection is following to get the feature count.
         * This needs a refactor when possible. Feature initialization, map edit operations
         * and retrain tasks should use the same format, which is not happening now.
         */
        const points =
          c.points.type === 'Feature'
            ? c.points.geometry.coordinates
            : c.points.coordinates;

        // Return the feature count
        return count + points.length + c.polygons.length;
      },
      0
    );

    nextState.sampleCount += Object.values(
      nextState.checkpointBrushes || {}
    ).reduce((count, c) => {
      return count + c.polygons.length;
    }, 0);
  }

  return nextState;
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
    checkpointList,
    setCheckpointList,
    loadCheckpointList,
  } = useCheckContext('useCheckpoint');

  return useMemo(
    () => ({
      currentCheckpoint,
      dispatchCurrentCheckpoint,
      fetchCheckpoint,
      checkpointList,
      setCheckpointList,
      loadCheckpointList,
    }),
    [
      currentCheckpoint,
      dispatchCurrentCheckpoint,
      fetchCheckpoint,
      checkpointList,
      loadCheckpointList,
    ]
  );
};
