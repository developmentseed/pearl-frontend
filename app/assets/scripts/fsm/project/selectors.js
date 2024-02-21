import get from 'lodash.get';

/**
 * Reusable selectors for the project FSM
 */
export const selectors = {
  aoiActionButtons: (state) => state.context.aoiActionButtons,
  aoiArea: (state) => state.context.currentAoi?.area,
  aoisList: (state) => get(state, 'context.aoisList', []),
  aoiStatusMessage: (state) => state.context.aoiStatusMessage,
  apiLimits: (state) => state.context.apiLimits,
  canSwitchInstanceType: (state) =>
    state.matches('Prediction ready') || state.matches('Retrain ready'),
  canExport: (state) =>
    state.context.currentTimeframe &&
    (state.matches('Prediction ready') || state.matches('Retrain ready')),
  canSaveCheckpoint: (state) => {
    return (
      // Must be in retrain tab
      state.matches('Retrain ready') &&
      // A checkpoint exists
      state.context.currentCheckpoint &&
      // It is not the base checkpoint
      state.context.currentCheckpoint.parent !== null &&
      // It is not already saved
      !state.context.currentCheckpoint.bookmarked
    );
  },
  checkpointList: (state) => state.context.checkpointList,
  currentAoi: (state) => state.context.currentAoi,
  currentAoiShape: (state) => state.context.currentAoiShape,
  currentAoiIsNew: ({ context: { currentAoi } }) =>
    currentAoi && !currentAoi.id,
  currentTimeframe: (state) => state.context.currentTimeframe,
  currentCheckpoint: (state) => state.context.currentCheckpoint,
  currentBatchPrediction: ({ context }) => context.currentBatchPrediction,
  currentImagerySource: (state) => state.context.currentImagerySource,
  currentInstanceType: (state) =>
    get(state, 'context.currentInstanceType', 'cpu'),
  currentInstanceWebsocket: (state) => state.context.currentInstanceWebsocket,
  currentModel: (state) => state.context.currentModel,
  currentMosaic: (state) => state.context.currentMosaic,
  currentPrediction: (state) => state.context.currentPrediction,
  currentShare: (state) => get(state, 'context.currentShare'),
  currentTilejson: (state) => get(state, 'context.currentTimeframe.tilejson'),
  displayProjectNameModal: (state) =>
    state.matches('Entering new project name'),
  globalLoading: (state) => state.context.globalLoading,
  imagerySourcesList: (state) => state.context.imagerySourcesList,
  isLoadingMap: (state) => state.matches('Creating map'),
  isRetrainReady: ({ context: { retrainClasses, retrainSamples } }) =>
    retrainClasses?.length > 0 && retrainSamples?.length > 0,
  isRevealed: (state) => state.context.aoiAreaModalDialogRevealed,
  liveInferenceArea: (state) => state.context.apiLimits?.live_inference,
  mapEventHandlers: (state) => state.context.mapEventHandlers,
  maxInferenceArea: (state) => state.context.apiLimits?.max_inference,
  modelsList: (state) => state.context.modelsList,
  mosaicsList: (state) => state.context.mosaicsList,
  mosaicTileUrl: (state) => get(state, 'context.currentMosaic.tileUrl'),
  projectId: ({ context }) => context.project?.id,
  projectName: (state) => get(state, 'context.project.name', ''),
  retrainActiveClass: (state) => state.context.retrainActiveClass,
  retrainClasses: (state) => state.context.retrainClasses,
  retrainMapMode: (state) => state.context.retrainMapMode,
  retrainSamples: (state) => state.context.retrainSamples,
  sessionMode: (state) => state.context.sessionMode,
  sessionStatusMessage: (state) =>
    get(state, 'context.sessionStatusMessage', {}),
  uploadAoiModal: (state) => state.context.uploadAoiModal,
};

export default selectors;
