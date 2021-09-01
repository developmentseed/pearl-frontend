import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, disabled as disabledStyles } from '@devseed-ui/theme-provider';

import { Button } from '@devseed-ui/button';
import { Form, FormInput } from '@devseed-ui/form';
import { Dropdown, DropdownBody } from '../../../styles/dropdown';
import { LocalButton } from '../../../styles/local-button';

import InfoButton from '../../common/info-button';
import { PanelBlockFooter } from '../../common/panel-block';
import { checkpointModes } from '../../../context/checkpoint';
import { useInstance } from '../../../context/instance';
import { Subheading } from '../../../styles/type/heading';
import { useAoi } from '../../../context/aoi';
import { useApiMeta } from '../../../context/api-meta';
import { Spinner } from '../../common/global-loading/styles';
import BatchPredictionProgressModal from './batch-progress-modal';
import { useState } from 'react';

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

function PrimeButton({ currentCheckpoint, allowInferenceRun, mapRef }) {
  const { runInference, runBatchPrediction, retrain, refine } = useInstance();
  const { aoiArea } = useAoi();
  const { apiLimits } = useApiMeta();

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
      action: retrain,
    },
    'live-prediction': {
      label: 'Run Model',
      action: runInference,
    },
    'batch-prediction': {
      label: 'Run Batch Prediction',
      action: runBatchPrediction,
    },
  };

  const run = runTypes[runType];

  return (
    <InfoButton
      data-cy='run-button'
      variation='primary-raised-dark'
      size='medium'
      useIcon='tick--small'
      style={{
        gridColumn: '1 / -1',
      }}
      onClick={run.action}
      visuallyDisabled={!allowInferenceRun}
      id='apply-button-trigger'
    >
      {run.label}
    </InfoButton>
  );
}

PrimeButton.propTypes = {
  currentCheckpoint: T.object,
  allowInferenceRun: T.bool.isRequired,
  mapRef: T.object,
};

function Footer({
  dispatchCurrentCheckpoint,
  currentCheckpoint,
  checkpointActions,
  updateCheckpointName,
  localCheckpointName,
  setLocalCheckpointName,
  mapRef,
  allowInferenceRun,
  disabled,
}) {
  const [displayBatchProgress, setDisplayBatchProgress] = useState(false);
  const { runningBatch } = useInstance();
  return (
    <PanelControls disabled={disabled}>
      <Button
        variation='base-plain'
        size='medium'
        useIcon='arrow-loop'
        style={{
          gridColumn: '1 / 2',
        }}
        title='Clear all samples drawn since last retrain or save'
        id='reset-button-trigger'
        disabled={!currentCheckpoint}
        visuallyDisabled={!currentCheckpoint}
        onClick={() => {
          dispatchCurrentCheckpoint({
            type: checkpointActions.CLEAR_SAMPLES,
          });
          mapRef.freehandDraw.clearLayers();
        }}
      >
        Clear
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

      <PrimeButton
        currentCheckpoint={currentCheckpoint}
        allowInferenceRun={allowInferenceRun}
        mapRef={mapRef}
      />
      {currentCheckpoint && currentCheckpoint.parent && (
        <Dropdown
          alignment='center'
          direction='up'
          triggerElement={(triggerProps) => (
            <InfoButton
              variation='primary-plain'
              size='medium'
              useIcon='save-disk'
              useLocalButton
              style={{
                gridColumn: '1 / -1',
              }}
              id='rename-button-trigger'
              {...triggerProps}
              disabled={!currentCheckpoint}
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
            onCloseClick={() => setDisplayBatchProgress(false)}
          />
          <ProgressButtonWrapper>
            <Spinner />
            <Button
              data-cy='batch-progress-message'
              variation='primary-plain'
              size='small'
              title='Status of running prediction'
              onClick={() => {
                setDisplayBatchProgress(true);
              }}
              id='batch-progress-message'
            >
              Batch prediction in progress: {runningBatch.progress}%
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
  checkpointActions: T.object,
  checkpointModes: T.object,
  updateCheckpointName: T.func,
  localCheckpointName: T.string,
  setLocalCheckpointName: T.func,

  mapRef: T.object,

  instance: T.object,
  allowInferenceRun: T.bool.isRequired,
  runInference: T.func,
  retrain: T.func,
  refine: T.func,

  disabled: T.bool,
};
export default Footer;
