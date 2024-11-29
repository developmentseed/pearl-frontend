/**
 * Session modes
 */
export const SESSION_MODES = {
  LOADING: 'LOADING',
  PREDICT: 'PREDICT',
  RETRAIN: 'RETRAIN',
};

/**
 * Retrain map modes
 */
export const RETRAIN_MAP_MODES = {
  BROWSE: 'BROWSE',
  ADD_POINT: 'ADD_POINT',
  ADD_POLYGON: 'ADD_POLYGON',
  ADD_FREEHAND: 'ADD_FREEHAND',
  REMOVE_SAMPLE: 'REMOVE_SAMPLE',
  DELETE_SAMPLES: 'DELETE_SAMPLES',
};

export const AOI_SHAPE_STATUS = {
  MIN: 4,
  MAX: 3,
  NO_LIVE: 2,
  LIVE: 1,
};
