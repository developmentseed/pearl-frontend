import React from 'react';
import { Heading } from '@devseed-ui/typography';

import T from 'prop-types';
import { useFetchList } from '../../../utils/use-async';
import Table, { TableRow, TableCell } from '../../common/table';
import { formatDateTime } from '../../../utils/format';
import { useState } from 'react';
import Paginator from '../../common/paginator';

const TABLE_PAGE_SIZE = 5;
const TABLE_HEADERS = ['Id', 'AOI Name', 'Status', 'Started'];
function renderRow({ id, name, completed, progress, created }) {
  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        {completed ? 'Completed' : `In Progress (${progress}%)`}
      </TableCell>
      <TableCell>{formatDateTime(created)}</TableCell>
    </TableRow>
  );
}

function BatchList({ projectId }) {
  const [page, setPage] = useState(1);
  const { result, status, error } = useFetchList(
    `project/${projectId}/batch?page=${page - 1}&limit=${TABLE_PAGE_SIZE}`
  );

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
        headers={TABLE_HEADERS}
        data={result.batch}
        renderRow={renderRow}
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
