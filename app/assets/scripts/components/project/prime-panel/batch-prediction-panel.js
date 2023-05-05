import React, { useCallback, useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
import { Spinner } from '../../common/global-loading/styles';
import { ProjectMachineContext } from '../../../context/project-xstate';
import { useAuth } from '../../../context/auth';
import logger from '../../../utils/logger';

import { Modal } from '@devseed-ui/modal';
import { formatDateTime, formatThousands } from '../../../utils/format';
import tArea from '@turf/area';
import Prose from '../../../styles/type/prose';
import DetailsList from '../../common/details-list';
import { AbortBatchJobButton } from '../../common/abort-batch-button';
import { StyledTooltip } from '../../common/tooltip';

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

const selectors = {
  projectId: ({ context }) => context.project?.id,
  currentBatchPrediction: ({ context }) => context.currentBatchPrediction,
};

function BatchPredictionProgressModal({
  runningBatch,
  revealed,
  disableAbortBtn,
  onCloseClick,
}) {
  // Calculate AOI Area
  let batchAoiArea;
  try {
    batchAoiArea = formatThousands(tArea(runningBatch.bounds) / 1e6);
  } catch (error) {
    logger(error);
  }

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
              'AOI Name': runningBatch.name,
              'AOI Size': `${batchAoiArea} km²` || 'Unknown',
            }}
          />
          <Block data-tip data-for='batch-starting-tooltip'>
            <AbortBatchJobButton
              projectId={runningBatch.project_id}
              batchId={runningBatch.id}
              disabled={disableAbortBtn}
              afterOnClickFn={async () => {
                onCloseClick();
              }}
            />
            {disableAbortBtn && (
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
  disableAbortBtn: T.bool,
  onCloseClick: T.func,
};

export default BatchPredictionProgressModal;

export function BatchPredictionPanel() {
  const { restApiClient } = useAuth();
  const currentBatchPrediction = ProjectMachineContext.useSelector(
    selectors.currentBatchPrediction
  );
  const projectId = ProjectMachineContext.useSelector(selectors.projectId);
  const [batchPredictionStatus, setBatchPredictionStatus] = useState(null);
  const [modalRevealed, setModalRevealed] = useState(false);
  const intervalRef = useRef();

  // if currentBatchPrediction has a value, start a recurring request to get the
  // batch prediction status
  const getRunningBatchPredictionStatus = useCallback(async () => {
    if (!projectId) return;
    try {
      const status = await restApiClient.get(
        `project/${projectId}/batch/${currentBatchPrediction.id}`
      );
      setBatchPredictionStatus(status);
    } catch (error) {
      logger(error);
    }
  }, [currentBatchPrediction, restApiClient, projectId]);

  useEffect(() => {
    // Create a new interval if none is running and there is a
    // currentBatchPrediction
    if (
      projectId?.id !== 'new' &&
      currentBatchPrediction &&
      !intervalRef.current &&
      !batchPredictionStatus
    ) {
      intervalRef.current = setInterval(getRunningBatchPredictionStatus, 1000);
    }

    // Clear interval if status is errored or aborted
    if (
      batchPredictionStatus &&
      (batchPredictionStatus.completed ||
        batchPredictionStatus.error ||
        batchPredictionStatus.abort)
    ) {
      clearInterval(intervalRef.current);
    }
  }, [
    projectId,
    currentBatchPrediction,
    intervalRef,
    batchPredictionStatus,
    restApiClient,
  ]);

  // Running prediction status is available
  if (!currentBatchPrediction || !batchPredictionStatus) return null;

  // Prediction is not errored or aborted
  if (
    batchPredictionStatus.completed ||
    batchPredictionStatus.error ||
    batchPredictionStatus.aborted
  )
    return null;

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
          {batchPredictionStatus.progress === 0
            ? 'Starting batch prediction...'
            : `Batch prediction in progress: ${batchPredictionStatus.progress}%`}
        </Button>
      </ProgressButtonWrapper>
    </>
  );
}
