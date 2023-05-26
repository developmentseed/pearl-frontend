import React from 'react';
import InfoButton from '../../common/info-button';
import { ProjectMachineContext } from '../../../fsm/project';
import selectors from '../../../fsm/project/selectors';
import { SESSION_MODES } from '../../../fsm/project/constants';
import * as guards from '../../../fsm/project/guards';

export function PrimeButton() {
  const actorRef = ProjectMachineContext.useActorRef();
  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const isLargeAoi = ProjectMachineContext.useSelector((s) =>
    guards.isLargeAoi(s.context)
  );
  const isPredictionReady = ProjectMachineContext.useSelector(({ context }) =>
    guards.isPredictionReady(context)
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
      onClick={() => {
        // Do nothing if button is disabled
        if (buttonDisabled) return;

        // Send the appropriate event to the FSM
        if (sessionMode === SESSION_MODES.PREDICT) {
          actorRef.send('Prime button pressed');
        } else if (sessionMode === SESSION_MODES.RETRAIN) {
          actorRef.send('Retrain requested');
        }
      }}
      visuallyDisabled={buttonDisabled}
      info={buttonTooltip}
    >
      {buttonLabel}
    </InfoButton>
  );
}
