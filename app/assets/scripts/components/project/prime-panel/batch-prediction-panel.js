import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
import { Spinner } from '../../common/global-loading/styles';
import { ProjectMachineContext } from '../../../context/project-xstate';
import { useAuth } from '../../../context/auth';
import logger from '../../../utils/logger';

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
  projectId: ({ context }) => context.project?.id,
  currentBatchPrediction: ({ context }) => context.currentBatchPrediction,
};

export function BatchPredictionPanel() {
  const { restApiClient } = useAuth();
  const currentBatchPrediction = ProjectMachineContext.useSelector(
    selectors.currentBatchPrediction
  );
  const projectId = ProjectMachineContext.useSelector(selectors.projectId);
  const [batchPredictionStatus, setBatchPredictionStatus] = useState(null);
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
      !batchPredictionStatus.completed &&
      (batchPredictionStatus.error || batchPredictionStatus.abort)
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
