import React from 'react';
import InfoButton from '../../common/info-button';
import { ProjectMachineContext } from '../../../fsm/project';

const selectors = {
  isPredictionReady: ({
    context: { currentImagerySource, currentMosaic, currentModel, currentAoi },
  }) =>
    !!currentAoi && !!currentImagerySource && !!currentMosaic && !!currentModel,
  isLargeAoi: ({ context: { currentAoi, apiLimits } }) => {
    return currentAoi?.area > apiLimits?.live_inference;
  },
};

export function PrimeButton() {
  const actorRef = ProjectMachineContext.useActorRef();
  const isPredictionReady = ProjectMachineContext.useSelector(
    selectors.isPredictionReady
  );
  const isLargeAoi = ProjectMachineContext.useSelector(selectors.isLargeAoi);

  const buttonLabel = isLargeAoi
    ? 'Run Batch Prediction'
    : 'Run Live Prediction';

  return (
    <InfoButton
      data-cy='prime-button'
      data-disabled={!isPredictionReady}
      variation='primary-raised-dark'
      size='medium'
      useIcon='tick--small'
      style={{
        gridColumn: '1 / -1',
      }}
      onClick={() => isPredictionReady && actorRef.send('Prime button pressed')}
      visuallyDisabled={!isPredictionReady}
      id='apply-button-trigger'
    >
      {buttonLabel}
    </InfoButton>
  );
}
