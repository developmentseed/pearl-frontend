import React from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

import { hideGlobalLoading, showGlobalLoadingMessage } from './global-loading';
import toasts from './toasts';
import { useAuth } from '../../context/auth';
import logger from '../../utils/logger';

export const AbortBatchJobButton = ({
  projectId,
  batchId,
  compact = false,
  disabled = false,
  afterOnClickFn = () => {},
}) => {
  const { restApiClient } = useAuth();

  return (
    <Button
      data-cy='abort-batch-job-btn'
      variation='danger-raised-dark'
      useIcon='xmark'
      disabled={disabled}
      hideText={compact}
      title='Abort batch job'
      onClick={async () => {
        try {
          showGlobalLoadingMessage('Aborting batch job...');
          const response = await restApiClient.patch(
            `project/${projectId}/batch/${batchId}`,
            { abort: true }
          );
          if (response.status === 200) {
            showGlobalLoadingMessage('Job aborted successfully');
          }
        } catch (err) {
          logger('Failed to abort job', err);
          toasts.error('Failed to abort job');
        }
        hideGlobalLoading();
        afterOnClickFn();
      }}
    >
      {!compact && 'Abort job'}
    </Button>
  );
};

AbortBatchJobButton.propTypes = {
  projectId: T.number,
  batchId: T.number,
  compact: T.bool,
  disabled: T.bool,
  afterOnClickFn: T.func,
};
