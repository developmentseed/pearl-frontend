/**
 * Reusable selectors for the project FSM
 */
export const selectors = {
  globalLoading: (state) => state.context.globalLoading,
  sessionMode: (state) => state.context.sessionMode,
  currentAoi: (state) => state.context.currentAoi,
  isPredictionReady: ({
    context: { currentImagerySource, currentMosaic, currentModel, currentAoi },
  }) =>
    !!currentAoi && !!currentImagerySource && !!currentMosaic && !!currentModel,
  isRetrainReady: ({ context: { retrainClasses, retrainSamples } }) =>
    retrainClasses?.length > 0 && retrainSamples?.length > 0,
  currentInstanceWebsocket: (state) => state.context.currentInstanceWebsocket,
};

export default selectors;
