import config from '../../config';

export const isLargeAoi = (context) => {
  const { currentAoi, apiLimits } = context;
  return currentAoi?.area > apiLimits?.live_inference;
};

export const retrainModeEnabled = (context) => {
  return !isLargeAoi(context) && context.currentTimeframe;
};

export const isRetrainReady = (context) => {
  return (
    context.retrainClasses?.length > 0 && context.retrainSamples?.length > 0
  );
};

export const isPredictionReady = (context) => {
  const {
    currentImagerySource,
    currentMosaic,
    currentModel,
    currentAoi,
    currentTimeframe,
  } = context;

  if (context.project.id === 'new') {
    return (
      !!currentAoi &&
      !!currentImagerySource &&
      !!currentMosaic &&
      !!currentModel
    );
  } else {
    return !!currentAoi && !!currentMosaic && !currentTimeframe;
  }
};

export const isProjectNew = (c) => c.project.id === 'new';
export const isFirstAoi = (c) => c.aoisList?.length === 0;
export const isAoiNew = ({ currentAoi }) => !currentAoi || !currentAoi.id;
export const isAuthenticated = (c) => c.isAuthenticated;

export const isLivePredictionAreaSize = ({ currentAoi, apiLimits }) =>
  currentAoi &&
  currentAoi.area > config.minimumAoiArea &&
  currentAoi.area < apiLimits.live_inference;

export const isBatchRunning = (c) => !!c.currentBatchPrediction;

export const hasAois = (c) => c.aoisList?.length > 0;

export const hasTimeframe = (c) => c.currentTimeframe;
