import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { Form, FormInput } from '@devseed-ui/form';
import { Dropdown, DropdownBody } from '../../../styles/dropdown';
import { LocalButton } from '../../../styles/local-button';

import InfoButton from '../../common/info-button';
import { PanelBlockFooter } from '../../common/panel-block';

const PanelControls = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};
  padding-bottom: ${glsp(2)};
`;
const SaveCheckpoint = styled(DropdownBody)`
  padding: ${glsp()};
`;

function Footer(props) {
  const {
    dispatchCurrentCheckpoint,
    currentCheckpoint,
    checkpointActions,
    checkpointModes,

    updateCheckpointName,
    localCheckpointName,
    setLocalCheckpointName,

    mapRef,

    allowInferenceRun,

    applyTooltip,
    runInference,
    retrain,
  } = props;
  return (
    <PanelControls>
      <Button
        variation='primary-raised-light'
        size='medium'
        useIcon='arrow-loop'
        style={{
          gridColumn: '1 / 2',
        }}
        title='Clear all samples drawn since last retrain or save'
        id='reset-button-trigger'
        onClick={() => {
          dispatchCurrentCheckpoint({
            type: checkpointActions.CLEAR_SAMPLES,
          });
          mapRef.polygonDraw.clearLayers();
        }}
      >
        Clear
      </Button>
      <Button
        variation='primary-raised-light'
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
          mapRef.polygonDraw.setLayerPolygons({
            ...latest.classes,
            ...latest.checkpointBrushes,
          });
        }}
        disabled={!(currentCheckpoint && currentCheckpoint.history.length)}
        id='undo-button-trigger'
      >
        Undo
      </Button>

      {currentCheckpoint &&
      currentCheckpoint.mode === checkpointModes.REFINE ? (
        <InfoButton
          data-cy='save-refine'
          variation='primary-raised-dark'
          size='medium'
          useIcon='tick--small'
          style={{
            gridColumn: '1 / -1',
          }}
          onClick={() => {}}
          // visuallyDisabled={!allowInferenceRun}
          // info={applyTooltip}
          info='Apply previous checkpoints and save drawn polygons to tiff'
          id='save-refine'
        >
          Save Refinements
        </InfoButton>
      ) : (
        <InfoButton
          data-cy={allowInferenceRun ? 'run-model-button' : 'disabled'}
          variation='primary-raised-dark'
          size='medium'
          useIcon='tick--small'
          style={{
            gridColumn: '1 / -1',
          }}
          onClick={() => {
            allowInferenceRun && !currentCheckpoint
              ? runInference()
              : retrain();
          }}
          visuallyDisabled={!allowInferenceRun}
          info={applyTooltip}
          id='apply-button-trigger'
        >
          {!currentCheckpoint ? 'Run Model' : 'Retrain'}
        </InfoButton>
      )}
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

  allowInferenceRun: T.bool,
  applyTooltip: T.string,
  runInference: T.func,
  retrain: T.func,
};
export default Footer;
