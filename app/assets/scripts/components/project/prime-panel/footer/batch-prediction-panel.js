import React, { useState } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
import { Spinner } from '../../../common/global-loading/styles';
import { ProjectMachineContext } from '../../../../fsm/project';
import logger from '../../../../utils/logger';

import { Modal } from '@devseed-ui/modal';
import { formatDateTime, formatThousands } from '../../../../utils/format';
import tArea from '@turf/area';
import Prose from '../../../../styles/type/prose';
import DetailsList from '../../../common/details-list';
import { AbortBatchJobButton } from '../../../common/abort-batch-button';
import { StyledTooltip } from '../../../common/tooltip';
import selectors from '../../../../fsm/project/selectors';

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

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
`;

const Block = styled.div`
  display: block;
  padding-top: 1rem;
`;

function BatchPredictionProgressModal({
  runningBatch,
  revealed,
  onCloseClick,
}) {
  // Calculate AOI Area
  let batchAoiArea;
  try {
    batchAoiArea = runningBatch?.aoi?.bounds
      ? `${formatThousands(tArea(runningBatch.aoi.bounds) / 1e6)} km²`
      : 'N/A';
  } catch (error) {
    logger(error);
  }

  const abortButtonDisabled = runningBatch?.progress === 0;

  return (
    <Modal
      id='batch-prediction-progress-modal'
      size='small'
      revealed={revealed}
      title='Batch Prediction Job Progress'
      closeButton={true}
      onCloseClick={onCloseClick}
      content={
        <Wrapper data-cy='batch-progress-modal-content'>
          <Prose className='prose'>
            Batch predictions run as a background process. You can still retrain
            smaller areas of interest (AOIs) while larger areas are running as
            batch prediction jobs.
          </Prose>
          <DetailsList
            details={{
              'Started at': formatDateTime(runningBatch.created),
              'AOI Name': runningBatch?.aoi?.name || 'N/A',
              'AOI Size': batchAoiArea,
            }}
          />
          <Block data-tip data-for='batch-starting-tooltip'>
            <AbortBatchJobButton
              projectId={runningBatch.project_id}
              batchId={runningBatch.id}
              disabled={abortButtonDisabled}
              afterOnClickFn={async () => {
                onCloseClick();
              }}
            />
            {abortButtonDisabled && (
              <StyledTooltip id='batch-starting-tooltip'>
                It will be possible to abort the job when it starts running
              </StyledTooltip>
            )}
          </Block>
        </Wrapper>
      }
    />
  );
}

BatchPredictionProgressModal.propTypes = {
  runningBatch: T.object,
  revealed: T.bool,
  onCloseClick: T.func,
};

export default BatchPredictionProgressModal;

export function BatchPredictionPanel() {
  const currentBatchPrediction = ProjectMachineContext.useSelector(
    selectors.currentBatchPrediction
  );
  const [modalRevealed, setModalRevealed] = useState(false);

  if (!currentBatchPrediction) return null;

  return (
    <>
      {currentBatchPrediction && (
        <BatchPredictionProgressModal
          runningBatch={currentBatchPrediction}
          revealed={modalRevealed}
          onCloseClick={() => setModalRevealed(false)}
        />
      )}
      <ProgressButtonWrapper>
        <Spinner />
        <Button
          data-cy='batch-progress-message'
          variation='primary-plain'
          size='small'
          id='batch-progress-message'
          onClick={() => setModalRevealed(true)}
        >
          {currentBatchPrediction.progress === 0
            ? 'Starting batch prediction...'
            : `Batch prediction in progress: ${currentBatchPrediction.progress}%`}
        </Button>
      </ProgressButtonWrapper>
    </>
  );
}
