import React, { createContext, useReducer } from 'react';
import T from 'prop-types';
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import differenceWith from 'lodash.differencewith';
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
  RECEIVE_METADATA: 'RECEIVE_METADATA',
  SET_ACTIVE_CLASS: 'SET_ACTIVE_CLASS',
  ADD_POINT_SAMPLE: 'ADD_POINT_SAMPLE',
  REMOVE_POINT_SAMPLE: 'REMOVE_POINT_SAMPLE',
};

function checkpointReducer(state, action) {
  switch (action.type) {
    case actions.SET_CHECKPOINT:
      return {
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
    default:
      throw new Error('Unexpected error.');
  }
}
