import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

import { themeVal, multiply } from '@devseed-ui/theme-provider';
import { listPageOptions } from '../../utils/pagination-options';

const PaginationWrapper = styled.nav`
  text-align: center;
  margin: ${themeVal('layout.space')};
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
`;

const PaginationSummary = styled.div`
  margin-top: ${themeVal('layout.space')};
  font-size: ${multiply(themeVal('type.base.root'), 0.8)};
  flex-basis: 100%;
`;

const PaginationButton = styled(Button)`
  margin-left: ${multiply(themeVal('layout.space'), 0.5)};

  &:first-child {
    margin-left: 0;
  }
`;
/**
 *
 * @param {Number} totalRecords - total number of items
 * @param {Number} pageSize - total number of pages
 * @param {Number} currentPage - current page
 * @param {Function} setPage - function to call to navigate to a page
 *                              (passed page number as param)
 */
function Paginator({ pageSize, currentPage, totalRecords, setPage }) {
  const maxPages = pageSize ? Math.ceil(totalRecords / pageSize) : 0;
  const pages = listPageOptions(currentPage + 1, maxPages);

  return (
    <PaginationWrapper>
      <PaginationButton
        data-cy='first-page-button'
        onClick={() => setPage(0)}
        disabled={currentPage === 0}
        useIcon='chevron-left-trail--small'
        hideText
        variation='base-plain'
        size='small'
      >
        First page
      </PaginationButton>
      <PaginationButton
        data-cy='previous-page-button'
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 0}
        useIcon='chevron-left--small'
        hideText
        variation='base-plain'
        size='small'
      >
        Previous page
      </PaginationButton>
      {pages.map((page) => {
        return (
          <PaginationButton
            onClick={() => setPage(page - 1)}
            key={`page-${page}`}
            variation={
              page === '...'
                ? 'base-plain'
                : currentPage + 1 === page
                ? 'primary-raised-dark'
                : 'base-plain'
            }
            disabled={page === '...'}
            data-cy={`page-${page}-button`}
            size='small'
          >
            {page}
          </PaginationButton>
        );
      })}
      <PaginationButton
        data-cy='next-page-button'
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === maxPages - 1}
        useIcon='chevron-right--small'
        hideText
        variation='base-plain'
        size='small'
      >
        Next page
      </PaginationButton>
      <PaginationButton
        data-cy='last-page-button'
        onClick={() => setPage(maxPages - 1)}
        disabled={currentPage === maxPages - 1}
        useIcon='chevron-right-trail--small'
        hideText
        variation='base-plain'
        size='small'
      >
        Last page
      </PaginationButton>
      <PaginationSummary>
        Showing {currentPage * pageSize + 1}-
        {Intl.NumberFormat().format(
          currentPage === maxPages - 1
            ? totalRecords
            : (currentPage + 1) * pageSize
        )}{' '}
        of {Intl.NumberFormat().format(totalRecords)}
      </PaginationSummary>
    </PaginationWrapper>
  );
}

Paginator.propTypes = {
  pageSize: T.number.isRequired,
  currentPage: T.number.isRequired,
  totalRecords: T.number.isRequired,
  setPage: T.func.isRequired,
};

export default Paginator;
