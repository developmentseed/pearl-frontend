import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
import { Spinner } from '../../common/global-loading/styles';
import { ProjectMachineContext } from '../../../context/project-xstate';
import { useParams } from 'react-router';
import { useAuth } from '../../../context/auth';

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

const selectors = {
  currentBatchPrediction: ({ context }) => context.currentBatchPrediction,
};

export function BatchPredictionPanel() {
  const { projectId } = useParams();
  const { restApiClient } = useAuth();
  const currentBatchPrediction = ProjectMachineContext.useSelector(
    selectors.currentBatchPrediction
  );
  const [batchPredictionStatus, setBatchPredictionStatus] = useState(null);
  const intervalRef = useRef();

  // if currentBatchPrediction has a value, start a recurring request to get the
  // batch prediction status
  const getRunningBatchPredictionStatus = useCallback(async () => {
    const status = await restApiClient.get(
      `project/${projectId}/batch/${currentBatchPrediction.id}}`
    );
    setBatchPredictionStatus(status);
  }, [currentBatchPrediction, restApiClient, projectId]);

  useEffect(() => {
    // Create a new interval if none is running and there is a
    // currentBatchPrediction
    if (
      currentBatchPrediction &&
      !intervalRef.current &&
      !batchPredictionStatus
    ) {
      intervalRef.current = setInterval(getRunningBatchPredictionStatus, 1000);
    }

    // Clear interval if status is errored or aborted
    if (
      batchPredictionStatus &&
      !batchPredictionStatus.completed &&
      (batchPredictionStatus.error || batchPredictionStatus.abort)
    ) {
      clearInterval(intervalRef.current);
    }
  }, [
    currentBatchPrediction,
    intervalRef,
    batchPredictionStatus,
    restApiClient,
  ]);

  // Running prediction status is available
  if (!currentBatchPrediction || !batchPredictionStatus) return null;

  // Prediction is not errored or aborted
  if (batchPredictionStatus.error || batchPredictionStatus.aborted) return null;

  return (
    <>
      <ProgressButtonWrapper>
        <Spinner />
        <Button
          data-cy='batch-progress-message'
          variation='primary-plain'
          size='small'
          id='batch-progress-message'
        >
          {batchPredictionStatus.progress === 0
            ? 'Starting batch prediction...'
            : `Batch prediction in progress: ${batchPredictionStatus.progress}%`}
        </Button>
      </ProgressButtonWrapper>
    </>
  );
}
