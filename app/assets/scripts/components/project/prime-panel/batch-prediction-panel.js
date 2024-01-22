import React, { useCallback, useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
import { Spinner } from '../../common/global-loading/styles';
import { ProjectMachineContext } from '../../../fsm/project';
import { useAuth } from '../../../context/auth';
import logger from '../../../utils/logger';

import { Modal } from '@devseed-ui/modal';
import { formatDateTime, formatThousands } from '../../../utils/format';
import tArea from '@turf/area';
import Prose from '../../../styles/type/prose';
import DetailsList from '../../common/details-list';
import { AbortBatchJobButton } from '../../common/abort-batch-button';
import { StyledTooltip } from '../../common/tooltip';
import get from 'lodash.get';
import selectors from '../../../fsm/project/selectors';

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
  const { restApiClient } = useAuth();
  const actorRef = ProjectMachineContext.useActorRef();
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

      // If the batch prediction is completed, get the tilejson
      if (status.completed) {
        const aoiId = get(status, 'aoi.id');
        const timeframeId = get(status, 'timeframe.id');
        // Confirm that the aoi and timeframe are available
        if (aoiId && timeframeId) {
          // Get the tilejson
          const tiles = await restApiClient.get(
            `project/${projectId}/aoi/${aoiId}/timeframe/${timeframeId}/tiles`
          );

          // Update the timeframe with the tilejson
          status.timeframe.tilejson = tiles;

          // Send a message to the project machine
          actorRef.send({
            type: 'Batch prediction completed',
            data: {
              timeframe: status.timeframe,
            },
          });
        }
      }

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
    batchPredictionStatus.abort
  )
    return null;

  return (
    <>
      {batchPredictionStatus && (
        <BatchPredictionProgressModal
          runningBatch={batchPredictionStatus}
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
