import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import tArea from '@turf/area';

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
import logger from '../../../utils/logger';
import useFetch from '../../../utils/use-fetch';
import { downloadGeotiff } from '../../../utils/share-link';
import { formatThousands } from '../../../utils/format';
import { composeMosaicName } from '../../../utils/mosaics';

const TABLE_PAGE_SIZE = 5;
const TABLE_HEADERS = [
  'Id',
  'AOI Name',
  'AOI Size (KM2)',
  'Started',
  'Mosaic',
  'Checkpoint',
  'Status',
  'Download',
];

const ProgressText = styled.span`
  padding-right: 0.5rem;
`;

export function DownloadAoiButton({
  disabled = false,
  projectId,
  timeframeId,
  aoi,
  uuid,
  children,
}) {
  const { restApiClient, isAuthenticated } = useAuth();
  const url = isAuthenticated
    ? `project/${projectId}/aoi/${aoi}/timeframe/${timeframeId}/download/color`
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
  timeframeId: T.number,
  uuid: T.string,
  children: T.node,
};

function getStatus(completed, abort, error) {
  if (error) return 'Errored';
  if (!completed && abort) return 'Aborted';
  if (completed) return 'Completed';
  return 'Processing';
}

const BatchRow = ({ batch, projectId }) => {
  const {
    id,
    aoi,
    mosaic,
    timeframe,
    completed,
    abort,
    error,
    progress,
    created,
  } = batch;
  const [status, setStatus] = useState(getStatus(completed, abort, error));
  const { restApiClient } = useAuth();
  const [checkpointName, setCheckpointName] = useState();
  useEffect(() => {
    async function fetchCheckpointName() {
      try {
        const data = await restApiClient.getCheckpoint(
          projectId,
          timeframe.checkpoint_id
        );
        setCheckpointName(data.name);
      } catch (error) {
        logger(error);
      }
    }
    fetchCheckpointName();
  }, []);

  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>{aoi?.name}</TableCell>
      <TableCell>{formatThousands(tArea(aoi?.bounds) / 1e6)}</TableCell>
      <TableCell>{formatDateTime(created)}</TableCell>
      <TableCell>
        {composeMosaicName(mosaic.mosaic_ts_start, mosaic.mosaic_ts_end)}
      </TableCell>
      <TableCell>{checkpointName}</TableCell>
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
      <TableCell>
        <DownloadAoiButton
          aoi={aoi?.id}
          projectId={projectId}
          timeframeId={timeframe?.id}
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
  const [page, setPage] = useState(0);
  const { isReady, data, hasError } = useFetch(
    `project/${projectId}/batch?page=${page}&limit=${TABLE_PAGE_SIZE}&order=desc`
  );

  if (!isReady) {
    return <Heading size='small'>Loading batch predictions...</Heading>;
  }

  if (hasError) {
    return (
      <Heading size='small'>Batch predictions could not be retrieved.</Heading>
    );
  }

  if (data && data.total === 0) {
    return (
      <section>
        <Heading size='small'>No batch predictions for this project.</Heading>
      </section>
    );
  }

  return (
    <section>
      <Heading size='small'>Batch Predictions</Heading>
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
        setPage={setPage}
        totalRecords={data.total}
        pageSize={TABLE_PAGE_SIZE}
      />
    </section>
  );
}

BatchList.propTypes = {
  projectId: T.string,
};

export default BatchList;
