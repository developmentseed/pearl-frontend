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

/**
 *
 * @param {Number} numPages - total number of pages
 * @param {Number} currentPage - current page
 * @param {Function} gotoPage - function to call to navigate to a page
 *                              (passed page number as param)
 */
function Paginator({ numPages, currentPage, gotoPage }) {
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
        Showing {currentPage} of {numPages}
      </div>
    </PaginatorContainer>
  );
}

Paginator.propTypes = {
  numPages: T.number,
  currentPage: T.number,
  gotoPage: T.func,
};

export default Paginator;
