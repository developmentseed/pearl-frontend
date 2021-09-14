import React from 'react';
import { Heading } from '@devseed-ui/typography';

import T from 'prop-types';
import Table, { TableRow, TableCell } from '../../common/table';
import { formatDateTime } from '../../../utils/format';
import { useState } from 'react';
import Paginator from '../../common/paginator';
import { Button } from '@devseed-ui/button';
import {
  hideGlobalLoading,
  showGlobalLoadingMessage,
} from '../../common/global-loading';
import { useAuth } from '../../../context/auth';
import { downloadGeotiff } from '../../../utils/map';
import logger from '../../../utils/logger';
import toasts from '../../common/toasts';
import useFetch from '../../../utils/use-fetch';

const TABLE_PAGE_SIZE = 5;
const TABLE_HEADERS = ['Id', 'AOI Name', 'Status', 'Started', 'Download'];

export function DownloadAoiButton({
  disabled = false,
  projectId,
  aoi,
  restApiClient,
  children,
}) {
  return (
    <Button
      variation='primary-plain'
      useIcon='download'
      visuallyDisabled={disabled}
      onClick={async () => {
        try {
          showGlobalLoadingMessage(
            'Preparing raw GeoTIFF, this may take a while...'
          );
          await restApiClient.get(
            `project/${projectId}/aoi/${aoi}/download/raw`,
            'binary'
          );
          const arrayBuffer = await restApiClient.downloadGeotiff(
            projectId,
            aoi
          );
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
  restApiClient: T.object,
  children: T.node,
};

function renderRow({
  id,
  aoi,
  name,
  completed,
  progress,
  created,
  projectId,
  restApiClient,
}) {
  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        {completed ? 'Completed' : `In Progress (${progress}%)`}
      </TableCell>
      <TableCell>{formatDateTime(created)}</TableCell>
      <TableCell>
        <DownloadAoiButton
          aoi={aoi}
          projectId={projectId}
          restApiClient={restApiClient}
          completed={!completed}
        />
      </TableCell>
    </TableRow>
  );
}

function BatchList({ projectId }) {
  const [page, setPage] = useState(1);
  const { isReady, data, hasError } = useFetch(
    `project/${projectId}/batch?page=${page - 1}&limit=${TABLE_PAGE_SIZE}`
  );
  const { restApiClient } = useAuth();

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
        renderRow={(batch) => renderRow({ ...batch, projectId, restApiClient })}
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
