import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, disabled as disabledStyles } from '@devseed-ui/theme-provider';

import { Button } from '@devseed-ui/button';
import { Form, FormInput } from '@devseed-ui/form';
import { Dropdown, DropdownBody } from '../../../styles/dropdown';
import { LocalButton } from '../../../styles/local-button';

import InfoButton from '../../common/info-button';
import { PanelBlockFooter } from '../../common/panel-block';
import {
  checkpointModes,
  actions as checkpointActions,
} from '../../../context/checkpoint';
import { useInstance } from '../../../context/instance';
import { Subheading } from '../../../styles/type/heading';
import { useAoi, useAoiName } from '../../../context/aoi';
import { useApiLimits } from '../../../context/global';
import { useMapState, sessionModes } from '../../../context/explore';
import { mapModes } from '../../../context/reducers/map';

import { Spinner } from '../../common/global-loading/styles';
import BatchPredictionProgressModal from './batch-progress-modal';
import { useSessionStatus } from '../../../context/explore';
import logger from '../../../utils/logger';
import {
  hideGlobalLoading,
  showGlobalLoadingMessage,
} from '../../common/global-loading';
import toasts from '../../common/toasts';

const PanelControls = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};

  ${({ disabled }) =>
    disabled &&
    css`
      ${disabledStyles()}
    `}
`;
const SaveCheckpoint = styled(DropdownBody)`
  padding: ${glsp()};
`;
const ProgressButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  grid-column: 1 / -1;
  > *,
  > *:before {
    font-size: 1rem;
  }
`;

function PrimeButton({
  currentCheckpoint,
  dispatchCurrentCheckpoint,
  mapRef,
  setAoiBounds,
}) {
  const { sessionStatus, setSessionStatusMode } = useSessionStatus();
  const {
    runPrediction,
    runBatchPrediction,
    runningBatch,
    retrain,
    refine,
  } = useInstance();
  const { aoiArea, setActiveModal, aoiRef, setCurrentAoi } = useAoi();
  const { updateAoiName } = useAoiName();
  const { apiLimits } = useApiLimits();
  const { mapState, setMapMode } = useMapState();

  const applyAoi = () => {
    setMapMode(mapModes.BROWSE_MODE);
    let bounds = aoiRef.getBounds();
    setAoiBounds(bounds);
    updateAoiName(bounds);

    // When AOI is edited -> we go to run mode
    dispatchCurrentCheckpoint({
      type: checkpointActions.SET_CHECKPOINT_MODE,
      data: {
        mode: checkpointModes.RUN,
      },
    });

    //Current AOI should only be set after AOI has been sent to the api
    setCurrentAoi(null);
  };

  const confirmAoi = () => {
    if (!apiLimits || apiLimits.live_inference > aoiArea) {
      applyAoi();
    } else if (apiLimits.max_inference > aoiArea) {
      setActiveModal('batch-inference');
    } else {
      setActiveModal('area-too-large');
    }
  };
  const cancelAoi = () => {
    setMapMode(mapModes.BROWSE_MODE);
    mapRef.aoi.control.draw.disable();
    //Edit mode is enabled as soon as draw is done
    if (mapRef.aoi.control.edit._shape) {
      mapRef.aoi.control.edit.disable();
    }
  };

  // If in refine mode, this button save refinements
  if (currentCheckpoint && currentCheckpoint.mode === checkpointModes.REFINE) {
    return (
      <InfoButton
        data-cy='save-refine'
        variation='primary-raised-dark'
        size='medium'
        useIcon='tick--small'
        style={{
          gridColumn: '1 / -1',
        }}
        onClick={() => {
          refine();
          mapRef.freehandDraw.clearLayers();
        }}
        id='save-refine'
      >
        Save Refinements
      </InfoButton>
    );
  }
  // In AOI EDIT MODE, this button will confirm the AOI
  else if (
    mapState.mode === mapModes.CREATE_AOI_MODE ||
    mapState.mode === mapModes.EDIT_AOI_MODE
  ) {
    return (
      <InfoButton
        data-cy='panel-aoi-confirm'
        variation='primary-raised-dark'
        size='medium'
        useIcon='tick--small'
        style={{
          gridColumn: '1 / -1',
        }}
        onClick={aoiRef ? confirmAoi : cancelAoi}
        id='panel-aoi-confirm'
      >
        {aoiRef ? 'Confirm Area Draw' : 'Cancel Area Draw'}
      </InfoButton>
    );
  }

  const isBatchArea =
    aoiArea && apiLimits && aoiArea > apiLimits['live_inference'];

  const runType = isBatchArea
    ? 'batch-prediction'
    : !currentCheckpoint || currentCheckpoint.mode === checkpointModes.RUN
    ? 'live-prediction'
    : 'retrain';

  const runTypes = {
    retrain: {
      label: 'Retrain',
      action: async () => {
        // Reset map mode
        setMapMode(mapModes.BROWSE_MODE);

        try {
          showGlobalLoadingMessage('Starting retraining...');
          setSessionStatusMode(sessionModes.RETRAINING);
          await retrain({
            onAbort: () => {
              setSessionStatusMode(sessionModes.RETRAIN_READY);
            },
          });
        } catch (error) {
          logger(error);
          if (error.message === 'No instances available') {
            toasts.error('No instances available, please try again later.', {
              autoClose: false,
              toastId: 'no-instance-available-error',
            });
          } else if (error.message === 'Instance creation failed') {
            toasts.error(
              'Could not start instance at the moment, please try again later.'
            );
          } else {
            toasts.error('Unexpected error, please try again later.');
          }
          hideGlobalLoading();
          setSessionStatusMode(sessionModes.RETRAIN_READY);
          return;
        }
      },
    },
    'live-prediction': {
      label: 'Ready for prediction run',
      action: async () => {
        // Reset map mode
        setMapMode(mapModes.BROWSE_MODE);

        try {
          setSessionStatusMode(sessionModes.RUNNING_PREDICTION);
          await runPrediction({
            onAbort: () => {
              setSessionStatusMode(sessionModes.PREDICTION_READY);
            },
          });
        } catch (error) {
          logger(error);

          hideGlobalLoading();
          if (error.message === 'Instance creation failed') {
            toasts.error(
              'Could not start instance at the moment, please try again later.'
            );
          } else if (error.message === 'No instances available') {
            toasts.error('No instances available, please try again later.');
          } else {
            toasts.error('Unexpected error, please try again later');
          }
          setSessionStatusMode(sessionModes.PREDICTION_READY);
        }
      },
    },
    'batch-prediction': {
      label: 'Run Batch Prediction',
      action: () => {
        setSessionStatusMode(sessionModes.RUNNING_PREDICTION);
        runBatchPrediction();
      },
    },
  };

  const run = runTypes[runType];

  const { mode } = sessionStatus;

  const checkDisabledState = () => {
    if (mode === sessionModes.PREDICTION_READY) {
      // Only one batch prediction permitted at a time
      if (runningBatch && isBatchArea) {
        return true;
      } else {
        return false;
      }
    } else if (mode === sessionModes.RETRAIN_READY) {
      // No retrain permitted for batch area
      if (isBatchArea) {
        return true;
      } else if (
        currentCheckpoint?.sampleCount > 0 ||
        currentCheckpoint.hasOsmLayers
      ) {
        // Allow retrain if sampleCount is nonzero
        return false;
      } else {
        return true;
      }
    } else {
      // If any other mode, disabled is true
      return true;
    }
  };
  const isDisabled = checkDisabledState();

  return (
    <InfoButton
      data-cy='run-button'
      data-disabled={isDisabled}
      variation='primary-raised-dark'
      size='medium'
      useIcon='tick--small'
      style={{
        gridColumn: '1 / -1',
      }}
      onClick={() => {
        !isDisabled && run.action();
      }}
      visuallyDisabled={isDisabled}
      id='apply-button-trigger'
    >
      {run.label}
    </InfoButton>
  );
}

PrimeButton.propTypes = {
  currentCheckpoint: T.object,
  mapRef: T.object,
  setAoiBounds: T.func,
  dispatchCurrentCheckpoint: T.func,
};

function Footer({
  dispatchCurrentCheckpoint,
  currentCheckpoint,
  checkpointActions,
  updateCheckpointName,
  localCheckpointName,
  setLocalCheckpointName,
  mapRef,
  disabled,
  setAoiBounds,
  useSampleControls,
}) {
  const [displayBatchProgress, setDisplayBatchProgress] = useState(false);
  const { runningBatch } = useInstance();

  return (
    <PanelControls data-cy='footer-panel-controls' data-disabled={disabled}>
      {useSampleControls && (
        <>
          <Button
            variation='base-plain'
            size='medium'
            useIcon='arrow-loop'
            style={{
              gridColumn: '1 / 2',
            }}
            title='Clear all samples drawn since last retrain or save'
            id='reset-button-trigger'
            disabled={!currentCheckpoint || currentCheckpoint.sampleCount === 0}
            visuallyDisabled={
              !currentCheckpoint || currentCheckpoint.sampleCount === 0
            }
            onClick={() => {
              dispatchCurrentCheckpoint({
                type: checkpointActions.CLEAR_SAMPLES,
              });
              mapRef.freehandDraw.clearLayers();
            }}
          >
            Clear All
          </Button>
          <Button
            variation='base-plain'
            size='medium'
            useIcon='arrow-semi-spin-ccw'
            style={{
              gridColumn: '2 / -1',
            }}
            title='Undo last performed action'
            onClick={() => {
              dispatchCurrentCheckpoint({
                type: checkpointActions.INPUT_UNDO,
              });

              const latest =
                currentCheckpoint.history[currentCheckpoint.history.length - 1];
              mapRef.freehandDraw.setLayerPolygons({
                ...latest.classes,
                ...latest.checkpointBrushes,
              });
            }}
            disabled={!(currentCheckpoint && currentCheckpoint.history?.length)}
            id='undo-button-trigger'
          >
            Undo
          </Button>
        </>
      )}

      <PrimeButton
        currentCheckpoint={currentCheckpoint}
        dispatchCurrentCheckpoint={dispatchCurrentCheckpoint}
        mapRef={mapRef}
        setAoiBounds={setAoiBounds}
      />
      {currentCheckpoint && currentCheckpoint.parent && (
        <Dropdown
          alignment='center'
          direction='up'
          triggerElement={(triggerProps) => (
            <InfoButton
              data-cy='save-checkpoint-button'
              variation='primary-plain'
              size='medium'
              useIcon='save-disk'
              useLocalButton
              style={{
                gridColumn: '1 / -1',
              }}
              id='rename-button-trigger'
              {...triggerProps}
            >
              Save Checkpoint
            </InfoButton>
          )}
        >
          <SaveCheckpoint>
            <Subheading>Checkpoint name:</Subheading>
            <Form
              onSubmit={(evt) => {
                evt.preventDefault();
                const name = evt.target.elements.checkpointName.value;
                updateCheckpointName(name);
              }}
            >
              <FormInput
                name='checkpointName'
                placeholder='Set Checkpoint Name'
                value={localCheckpointName}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => setLocalCheckpointName(e.target.value)}
                autoFocus
              />
              <LocalButton
                type='submit'
                variation='primary-plain'
                useIcon='save-disk'
                title='Rename checkpoint'
                data-dropdown='click.close'
              >
                Save
              </LocalButton>
            </Form>
          </SaveCheckpoint>
        </Dropdown>
      )}
      {runningBatch && (
        <>
          <BatchPredictionProgressModal
            revealed={displayBatchProgress}
            disableAbortBtn={runningBatch.progress === 0}
            onCloseClick={() => setDisplayBatchProgress(false)}
          />
          <ProgressButtonWrapper>
            <Spinner />
            <Button
              data-cy='batch-progress-message'
              variation='primary-plain'
              size='small'
              onClick={() => {
                setDisplayBatchProgress(true);
              }}
              id='batch-progress-message'
            >
              {runningBatch.progress === 0
                ? 'Starting batch prediction...'
                : `Batch prediction in progress: ${runningBatch.progress}%`}
            </Button>
          </ProgressButtonWrapper>
        </>
      )}
    </PanelControls>
  );
}

Footer.propTypes = {
  dispatchCurrentCheckpoint: T.func,
  currentCheckpoint: T.object,
  checkpointHasSamples: T.bool,
  checkpointActions: T.object,
  checkpointModes: T.object,
  updateCheckpointName: T.func,
  localCheckpointName: T.string,
  setLocalCheckpointName: T.func,

  mapRef: T.object,

  instance: T.object,
  runPrediction: T.func,
  retrain: T.func,
  refine: T.func,

  disabled: T.bool,

  setAoiBounds: T.func,

  useSampleControls: T.bool,
};
export default Footer;
