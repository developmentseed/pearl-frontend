import config from '../../config';

export const guards = {
  isLargeAoi: ({ currentAoi, apiLimits }) => {
    return currentAoi?.area > apiLimits?.live_inference;
  },
  isProjectNew: (c) => c.project.id === 'new',
  isFirstAoi: (c) => c.aoisList?.length === 0,
  isAoiNew: ({ currentAoi }) => !currentAoi || !currentAoi.id,
  isAuthenticated: (c) => c.isAuthenticated,
  isLivePredictionAreaSize: ({ currentAoi, apiLimits }) =>
    currentAoi &&
    currentAoi.area > config.minimumAoiArea &&
    currentAoi.area < apiLimits.live_inference,
  hasAois: (c) => c.aoisList?.length > 0,
};

export default guards;
