import logger from '../../utils/logger';

export const instanceActionTypes = {
  APPLY_STATUS: 'APPLY_STATUS',
};

export default function instanceReducer(state, action) {
  const { type, data } = action;
  let newState = state;

  switch (type) {
    case instanceActionTypes.APPLY_STATUS: {
      // gpuStatus will change, update previousGpuStatus
      if (data.gpuStatus && data.gpuStatus !== state.gpuStatus) {
        newState.previousGpuStatus = state.gpuStatus;
      }

      // Apply passed data
      newState = {
        ...newState,
        ...data,
      };

      break;
    }
    default:
      logger('Unexpected instance action type: ', action);
      throw new Error('Unexpected error.');
  }

  // Update display message for some GPU states.
  if (data.gpuStatus === 'aborting') {
    newState.gpuMessage = 'Aborting...';
  } else if (data.gpuStatus === 'ready') {
    newState.gpuMessage = 'Ready to go';
  }

  // Uncomment this to log instance state
  // logger(newState);

  return newState;
}
