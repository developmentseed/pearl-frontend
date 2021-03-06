import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';

import Table, { TableRow, TableCell } from '../../common/table';
import Paginator from '../../common/paginator';
import {
  hideGlobalLoading,
  showGlobalLoadingMessage,
} from '../../common/global-loading';
import toasts from '../../common/toasts';
import { AbortBatchJobButton } from '../../common/abort-batch-button';
import { useAuth } from '../../../context/auth';
import { formatDateTime } from '../../../utils/format';
import { downloadGeotiff } from '../../../utils/map';
import logger from '../../../utils/logger';
import useFetch from '../../../utils/use-fetch';

const TABLE_PAGE_SIZE = 5;
const TABLE_HEADERS = ['Id', 'AOI Name', 'Status', 'Started', 'Download'];

const ProgressText = styled.span`
  padding-right: 0.5rem;
`;

export function DownloadAoiButton({
  disabled = false,
  projectId,
  aoi,
  uuid,
  children,
}) {
  const { restApiClient, isAuthenticated } = useAuth();
  const url = isAuthenticated
    ? `project/${projectId}/aoi/${aoi}/download/color`
    : `share/${uuid}/download/color`;
  return (
    <Button
      variation='primary-raised-dark'
      hideText={!children}
      useIcon='download'
      visuallyDisabled={disabled}
      onClick={async () => {
        try {
          showGlobalLoadingMessage(
            'Preparing raw GeoTIFF, this may take a while...'
          );
          const arrayBuffer = await restApiClient.get(url, 'binary');
          const filename = `${aoi}.tiff`;
          downloadGeotiff(arrayBuffer, filename);
        } catch (err) {
          logger('Failed to download geotiff', err);
          toasts.error('Failed to download GeoTIFF');
        }
        hideGlobalLoading();
      }}
    >
      {children}
    </Button>
  );
}

DownloadAoiButton.propTypes = {
  disabled: T.bool,
  projectId: T.number,
  aoi: T.number,
  uuid: T.string,
  children: T.node,
};

function getStatus(completed, abort) {
  if (!completed && abort) return 'Aborted';
  if (completed) return 'Completed';
  return 'Processing';
}

const BatchRow = ({ batch, projectId }) => {
  const { id, aoi, name, completed, abort, progress, created } = batch;
  const [status, setStatus] = useState(getStatus(completed, abort));

  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        {status === 'Processing' ? (
          <>
            <ProgressText>In Progress ({progress}%)</ProgressText>
            <AbortBatchJobButton
              projectId={projectId}
              batchId={id}
              compact
              disabled={progress === 0}
              afterOnClickFn={() => setStatus('Aborted')}
            />
          </>
        ) : (
          status
        )}
      </TableCell>
      <TableCell>{formatDateTime(created)}</TableCell>
      <TableCell>
        <DownloadAoiButton
          aoi={aoi}
          projectId={projectId}
          disabled={!completed}
        />
      </TableCell>
    </TableRow>
  );
};

BatchRow.propTypes = {
  batch: T.object,
  projectId: T.number,
};

function BatchList({ projectId }) {
  const [page, setPage] = useState(1);
  const { isReady, data, hasError } = useFetch(
    `project/${projectId}/batch?page=${
      page - 1
    }&limit=${TABLE_PAGE_SIZE}&order=desc`
  );

  if (!isReady) {
    return <Heading>Loading batch predictions...</Heading>;
  }

  if (hasError) {
    return <Heading>Batch predictions could not be retrieved.</Heading>;
  }

  if (data && data.total === 0) {
    return <Heading>No batch predictions for this project.</Heading>;
  }

  return (
    <>
      <Heading>Batch Predictions</Heading>
      <Table
        data-cy='batch-list-table'
        headers={TABLE_HEADERS}
        data={data.batch}
        renderRow={(batch) => (
          <BatchRow
            key={batch.id}
            projectId={Number(projectId)}
            batch={batch}
          />
        )}
      />
      <Paginator
        currentPage={page}
        gotoPage={setPage}
        totalItems={data.total}
        itemsPerPage={TABLE_PAGE_SIZE}
      />
    </>
  );
}

BatchList.propTypes = {
  projectId: T.string,
};

export default BatchList;
