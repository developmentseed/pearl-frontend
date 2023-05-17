/**
 * Reusable selectors for the project FSM
 */
export const selectors = {
  isPredictionReady: ({
    context: { currentImagerySource, currentMosaic, currentModel, currentAoi },
  }) =>
    !!currentAoi && !!currentImagerySource && !!currentMosaic && !!currentModel,
  isLargeAoi: ({ context: { currentAoi, apiLimits } }) => {
    return currentAoi?.area > apiLimits?.live_inference;
  },
};

export default selectors;
