import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import fill from 'fill-range';

import { Button } from '@devseed-ui/button';

const PaginatorContainer = styled.section`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
`;

const Pager = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  list-style-type: none !important;
  & > :not(:first-child) {
    margin-left: 1rem;
  }
  ${Button} {
    box-shadow: none;
  }
`;

const PageButton = styled(Button)`
  & ~ & {
    margin-left: 0.5rem;
  }
`;

// Print range of page items
// From https://stackoverflow.com/questions/47698412/pagination-in-javascript-showing-amount-of-elements-per-page
function renderPageRange(totalItems, itemsPerPage) {
  function getPageStart(pageSize, pageNr) {
    return pageSize * pageNr;
  }

  function getPageLabel(total, pageSize, pageNr) {
    const start = Math.max(getPageStart(pageSize, pageNr), 0);
    const end = Math.min(getPageStart(pageSize, pageNr + 1), total);

    return `${start + 1} - ${end}`;
  }

  const size = itemsPerPage;
  const pages = Array.from({ length: Math.ceil(totalItems / size) }, (_, i) =>
    getPageLabel(totalItems, size, i)
  );
  return pages;
}

/**
 *
 * @param {Number} totalItems - total number of items
 * @param {Number} itemsPerPage - total number of pages
 * @param {Number} currentPage - current page
 * @param {Function} gotoPage - function to call to navigate to a page
 *                              (passed page number as param)
 */
function Paginator({ currentPage, gotoPage, totalItems, itemsPerPage }) {
  const numPages = Math.ceil(totalItems / itemsPerPage);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < numPages;
  return (
    <PaginatorContainer>
      <Pager>
        <li>
          <Button
            disabled={!hasPrev}
            size='small'
            variation='base-raised-semidark'
            useIcon='chevron-left--small'
            hideText
            onClick={() => {
              if (hasPrev) {
                gotoPage(currentPage - 1);
              }
            }}
          >
            Previous
          </Button>
        </li>
        <li>
          {fill(1, numPages).map((pageNumber) => (
            <PageButton
              key={pageNumber}
              isCurrent={pageNumber === currentPage}
              variation={pageNumber === currentPage && 'primary-plain'}
              onClick={() => gotoPage(pageNumber)}
            >
              {pageNumber}
            </PageButton>
          ))}
        </li>
        <li>
          <Button
            disabled={!hasNext}
            size='small'
            variation='base-raised-semidark'
            useIcon='chevron-right--small'
            hideText
            onClick={() => {
              if (hasNext) {
                gotoPage(currentPage + 1);
              }
            }}
          >
            Next
          </Button>
        </li>
      </Pager>
      <div>
        Showing {renderPageRange(totalItems, itemsPerPage)[currentPage - 1]} of{' '}
        {totalItems}
      </div>
    </PaginatorContainer>
  );
}

Paginator.propTypes = {
  itemsPerPage: T.number,
  currentPage: T.number,
  gotoPage: T.func,
  totalItems: T.number,
};

export default Paginator;
