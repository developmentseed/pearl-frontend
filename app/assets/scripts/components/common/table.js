import React from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

const StyledTable = styled.table`
  width: 100%;
  max-width: 100%;
  td,
  th {
    padding: ${glsp(1 / 4)};
    vertical-align: top;
    text-align: left;
  }
  thead th {
    letter-spacing: 0.4px;
    vertical-align: middle;
    position: relative;
    text-align: left;
    a {
      display: inline-flex;
    }
    a,
    a:visited,
    a:hover {
      color: inherit;
    }
  }
  tbody th,
  tbody td {
    text-align: left;
    vertical-align: baseline;
    border-bottom: ${themeVal('layout.border')} solid
      ${themeVal('color.baseAlphaB')};
  }
  th:first-child,
  td:first-child {
    padding-left: ${glsp()};
  }
  th:last-child,
  td:last-child {
    padding-right: ${glsp()};
  }
  tbody tr:hover {
    background: ${({ hoverable }) =>
      hoverable &&
      css`
        ${themeVal('color.primaryAlphaA')}
      `};
  }
`;

const TableHeader = styled.thead``;

const TableBody = styled.tbody``;

export const TableRow = styled.tr``;

export const TableCell = styled.td`
  > * {
    vertical-align: inherit;
    font-size: inherit;
  }
`;

/**
 *
 * @param {Array<String>} headers - header columns, as strings
 * @param {Array<Object>} data - array of data objects
 * @param {Function} renderRow - function which receives data objects and returns a <tr>
 */
function Table({ headers, data, renderRow, extraData, hoverable }) {
  return (
    <StyledTable hoverable={hoverable}>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <Heading key={header} as='th' useAlt>
              {header}
            </Heading>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{data.map((d) => renderRow(d, extraData))}</TableBody>
    </StyledTable>
  );
}

Table.propTypes = {
  headers: T.array,
  data: T.array,
  renderRow: T.func,
  extraData: T.array,
  hoverable: T.bool,
};

export default Table;
