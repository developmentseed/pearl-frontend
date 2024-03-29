import React from 'react';
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import T from 'prop-types';
import {
  glsp,
  themeVal,
  stylizeFunction,
  media,
} from '@devseed-ui/theme-provider';
import { Subheading } from '../../styles/type/heading';

const _rgba = stylizeFunction(rgba);

const StyledTable = styled.table`
  width: 100%;
  max-width: 100%;
  table-layout: ${({ fixedTable }) => fixedTable && 'fixed'};
  td,
  th {
    padding: ${glsp(3 / 8)};
    vertical-align: top;
    text-align: left;
    font-size: 0.875rem;
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
      ${themeVal('color.baseAlphaD')};
    ${({ fixedTable }) =>
      fixedTable &&
      css`
        overflow: hidden;
        text-overflow: ellipsis;
        text-wrap: nowrap;
      `}
  }
  tbody td {
    background: ${_rgba(themeVal('color.surface'), 0.32)};
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
        ${themeVal('color.primaryAlphaB')}
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
  ${media.mediumDown`
    [class*='FormGroupBody'] {
      grid-template-columns: minmax(1px, 1fr);
    }
  `}
`;
export const TableRowHeader = styled(Subheading)`
  letter-spacing: 0.4px;
  vertical-align: middle;
  position: relative;
  text-align: left;
  font-weight: bold;
  color: ${themeVal('color.primary')};
`;

/**
 *
 * @param {Array<String>} headers - header columns, as strings
 * @param {Array<Object>} data - array of data objects
 * @param {Function} renderRow - function which receives data objects and returns a <tr>
 * @param {Object} extraData - arbitrary extra data that will be passed to renderRow as second argument
 */
function Table({ headers, data, renderRow, extraData, hoverable, fixedTable }) {
  return (
    <StyledTable hoverable={hoverable} fixedTable={fixedTable}>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <Subheading key={header} as='th'>
              {header}
            </Subheading>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{data.map((d, i) => renderRow(d, extraData, i))}</TableBody>
    </StyledTable>
  );
}

Table.propTypes = {
  headers: T.array,
  data: T.array,
  renderRow: T.func,
  extraData: T.object,
  hoverable: T.bool,
  fixedTable: T.bool,
};

export default Table;
