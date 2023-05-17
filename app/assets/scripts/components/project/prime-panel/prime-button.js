import React from 'react';
import InfoButton from '../../common/info-button';
import { ProjectMachineContext } from '../../../fsm/project';
import selectors from '../../../fsm/project/selectors';
import { SESSION_MODES } from '../../../fsm/project/constants';

export function PrimeButton() {
  const actorRef = ProjectMachineContext.useActorRef();
  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const isLargeAoi = ProjectMachineContext.useSelector(selectors.isLargeAoi);
  const isPredictionReady = ProjectMachineContext.useSelector(
    selectors.isPredictionReady
  );
  const isRetrainReady = ProjectMachineContext.useSelector(
    selectors.isRetrainReady
  );

  let buttonLabel;
  let buttonDisabled = false;
  let buttonTooltip;
  if (sessionMode === SESSION_MODES.PREDICT) {
    buttonLabel = isLargeAoi ? 'Run Batch Prediction' : 'Run Live Prediction';
    buttonDisabled = !isPredictionReady;
  } else if (sessionMode === SESSION_MODES.RETRAIN) {
    buttonLabel = 'Retrain Model';
    buttonDisabled = !isRetrainReady;
    buttonTooltip = !isRetrainReady && 'Select classes and samples to retrain';
  }

  return (
    <InfoButton
      id='apply-button-trigger'
      data-cy='prime-button'
      data-disabled={buttonDisabled}
      variation='primary-raised-dark'
      size='medium'
      useIcon='tick--small'
      style={{
        gridColumn: '1 / -1',
      }}
      onClick={() => !buttonDisabled && actorRef.send('Prime button pressed')}
      visuallyDisabled={buttonDisabled}
      info={buttonTooltip}
    >
      {buttonLabel}
    </InfoButton>
  );
}
