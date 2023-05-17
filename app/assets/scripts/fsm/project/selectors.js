/**
 * Reusable selectors for the project FSM
 */
export const selectors = {
  sessionMode: (state) => state.context.sessionMode,
  currentAoi: (state) => state.context.currentAoi,
  isPredictionReady: ({
    context: { currentImagerySource, currentMosaic, currentModel, currentAoi },
  }) =>
    !!currentAoi && !!currentImagerySource && !!currentMosaic && !!currentModel,
  isRetrainReady: ({ context: { retrainClasses, retrainSamples } }) =>
    retrainClasses?.length > 0 && retrainSamples?.length > 0,
  isLargeAoi: ({ context: { currentAoi, apiLimits } }) => {
    return currentAoi?.area > apiLimits?.live_inference;
  },
};

export default selectors;
