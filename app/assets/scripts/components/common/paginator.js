import React from 'react';
import styled, { css } from 'styled-components';
import fill from 'fill-range';

const PaginatorContainer = styled.div``;

const PageNumber = styled.span``;

const PrevArrow = styled.div`
  content: '<';
  cursor: pointer;
`;

const NextArrow = styled.div`
  content: '>';
  cursor: pointer;
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
      <PrevArrow
        disabled={!hasPrev}
        onClick={() => {
          if (hasPrev) {
            gotoPage(currentPage - 1);
          }
        }} 
      />
      <NextArrow
        disabled={!hasNext}
        onClick={() => {
          if (hasNext) {
            gotoPage(currentPage + 1);
          }
        }} 
      />
      {fill(1, numPages).map((pageNumber) => (
        <PageNumber
          key={pageNumber}
          isCurrent={pageNumber === currentPage}
          onClick={() => gotoPage(pageNumber)}
        >
          {pageNumber}
        </PageNumber>
      ))}
      <div>Showing { currentPage } of { numPages }</div>
    </PaginatorContainer>
  );
}

export default Paginator;
