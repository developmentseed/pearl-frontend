import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, disabled as disabledStyles } from '@devseed-ui/theme-provider';

import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { Form, FormInput } from '@devseed-ui/form';
import { Dropdown, DropdownBody } from '../../../styles/dropdown';
import { LocalButton } from '../../../styles/local-button';

import InfoButton from '../../common/info-button';
import { PanelBlockFooter } from '../../common/panel-block';
import { checkpointModes } from '../../../context/checkpoint';
import { useInstance } from '../../../context/instance';
import { useAuth } from '../../../context/auth';
import toasts from '../../common/toasts';
import logger from '../../../utils/logger';

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

function PrimeButton({ currentCheckpoint, allowInferenceRun, mapRef }) {
  const { runInference, retrain, refine } = useInstance();
  const { restApiClient } = useAuth();

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

  const runText =
    !currentCheckpoint || !currentCheckpoint.parent
      ? 'Run model'
      : 'Run checkpoint';

  return (
    <InfoButton
      data-cy='run-button'
      variation='primary-raised-dark'
      size='medium'
      useIcon='tick--small'
      style={{
        gridColumn: '1 / -1',
      }}
      onClick={async () => {
        // Run inference if no previous checkpoints
        if (
          !currentCheckpoint ||
          currentCheckpoint.mode === checkpointModes.RUN
        ) {
          try {
            // Get available instances
            const {
              limits: { active_gpus, total_gpus },
            } = await restApiClient.get('');
            const availableGpus = total_gpus - (active_gpus || 0);

            // Do not run when no instances are available
            if (availableGpus && availableGpus > 0) {
              runInference();
            } else {
              toasts.error(
                'No instance available to run the model, please try again later.',
                { autoClose: false, toastId: 'run-model-error' }
              );
            }
          } catch (error) {
            logger(error);
            toasts.error('Unexpected error, please try again later.');
          }

          // Finish run inference workflow
          return;
        }

        // Retrain workflow
        retrain();
        mapRef.freehandDraw.clearLayers();
      }}
      visuallyDisabled={!allowInferenceRun}
      id='apply-button-trigger'
    >
      {!currentCheckpoint || currentCheckpoint.mode === checkpointModes.RUN
        ? runText
        : 'Retrain Model'}
    </InfoButton>
  );
}

PrimeButton.propTypes = {
  currentCheckpoint: T.object,
  allowInferenceRun: T.bool.isRequired,
  mapRef: T.object,
};

function Footer(props) {
  const {
    dispatchCurrentCheckpoint,
    currentCheckpoint,
    checkpointActions,

    updateCheckpointName,
    localCheckpointName,
    setLocalCheckpointName,

    mapRef,

    allowInferenceRun,

    disabled,
  } = props;

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
            <Heading useAlt>Checkpoint name:</Heading>
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
                // size='small'
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
