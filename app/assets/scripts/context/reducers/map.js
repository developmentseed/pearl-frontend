import logger from '../../utils/logger';

export const mapActionTypes = {
  SET_MODE: 'SET_MODE',
  SET_ACTIVE_CLASS: 'SET_ACTIVE_CLASS',
  SET_CLASS_EDIT_MODE: 'SET_CLASS_EDIT_MODE',
};

export const mapModes = {
  BROWSE_MODE: 'BROWSE_MODE',
  CREATE_AOI_MODE: 'CREATE_AOI_MODE',
  EDIT_AOI_MODE: 'EDIT_AOI_MODE',
  ADD_CLASS_SAMPLES: 'ADD_CLASS_SAMPLES',
  ADD_POINT_SAMPLES: 'ADD_POINT_SAMPLES',
  ADD_SAMPLE_POLYGON: 'ADD_SAMPLE_POLYGON',
  REMOVE_SAMPLE: 'REMOVE_SAMPLE',
};

export function mapStateReducer(state, action) {
  switch (action.type) {
    case mapActionTypes.SET_MODE:
      return {
        ...state,
        previousMode: state.mode,
        mode: action.data,
      };
    case mapActionTypes.SET_ACTIVE_CLASS:
      return {
        ...state,
        activeClass: action.data,
      };
    case mapActionTypes.SET_CLASS_EDIT_MODE:
      return {
        ...state,
        classEditMode: action.data,
      };
    default:
      logger('Unexpected map action: ', action.type);
      throw new Error('Unexpected error.');
  }
}
