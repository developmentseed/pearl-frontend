import React from 'react';
import styled, { css } from 'styled-components';
import fill from 'fill-range';

const PaginatorContainer = styled.div``;

const PageNumber = styled.span``;

/**
 * 
 * @param {Number} numPages - total number of pages
 * @param {Number} currentPage - current page
 * @param {Function} gotoPage - function to call to navigate to a page
 *                              (passed page number as param) 
 */
function Paginator({
  numPages,
  currentPage,
  gotoPage
}) {
  return (
    <PaginatorContainer>
      {fill(1, numPages).map((pageNumber) => (
        <PageNumber
          key={pageNumber}
          isCurrent={pageNumber === currentPage}
          onClick={() => gotoPage(pageNumber)}
        >
          {pageNumber}
        </PageNumber>
      ))}
    </PaginatorContainer>
  );
}

export default Paginator;