import React from 'react';
import styled, { css } from 'styled-components';

const StyledTable = styled.table``;

const TableHeader = styled.thead``;

const TableHeaderCell = styled.th``;

const TableBody = styled.tbody``;

export const TableRow = styled.tr``;

export const TableCell = styled.td``;

/**
 *
 * @param {Array<String>} headers - header columns, as strings
 * @param {Array<Object>} data - array of data objects
 * @param {Function} renderRow - function which receives data objects and returns a <tr>
 */
function Table({ headers, data, renderRow, extraData }) {
  return (
    <StyledTable>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHeaderCell key={header}>{header}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{data.map((d) => renderRow(d, extraData))}</TableBody>
    </StyledTable>
  );
}

export default Table;
