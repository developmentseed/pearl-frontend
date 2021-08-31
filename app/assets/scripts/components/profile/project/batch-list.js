import React from 'react';
import { Heading } from '@devseed-ui/typography';

import T from 'prop-types';
import { useFetchList } from '../../../utils/use-async';
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

const TABLE_PAGE_SIZE = 5;
const TABLE_HEADERS = ['Id', 'AOI Name', 'Status', 'Started', 'Download'];
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
        <Button
          variation='primary-plain'
          useIcon='download'
          visuallyDisabled={!completed}
          hideText
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
        />
      </TableCell>
    </TableRow>
  );
}

function BatchList({ projectId }) {
  const [page, setPage] = useState(1);
  const { result, status, error } = useFetchList(
    `project/${projectId}/batch?page=${page - 1}&limit=${TABLE_PAGE_SIZE}`
  );
  const { restApiClient } = useAuth();

  if (status === 'idle' || status === 'loading') {
    return <Heading>Loading batch predictions...</Heading>;
  }

  if (error) {
    return <Heading>Batch predictions could not be retrieved.</Heading>;
  }

  if (result.batch && result.batch.length === 0) {
    return <Heading>No batch predictions for this project.</Heading>;
  }

  return (
    <>
      <Heading>Batch Predictions</Heading>
      <Table
        data-cy='batch-list-table'
        headers={TABLE_HEADERS}
        data={result.batch}
        renderRow={(batch) => renderRow({ ...batch, projectId, restApiClient })}
      />
      <Paginator
        currentPage={page}
        gotoPage={setPage}
        totalItems={result.total}
        itemsPerPage={TABLE_PAGE_SIZE}
      />
    </>
  );
}

BatchList.propTypes = {
  projectId: T.string,
};

export default BatchList;
