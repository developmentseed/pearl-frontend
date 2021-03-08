import React from 'react';
import styled, { css } from 'styled-components';
import ShadowScrollbar from '../common/shadow-scrollbar';
import { PanelBlockBody } from '../common/panel-block';
import DetailsList from './details-list';
import T from 'prop-types';

import { truncated, themeVal, glsp } from '@devseed-ui/theme-provider';

const CardMedia = styled.figure`
  display: flex;
  position: relative;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    content: '';
    box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaB')};
    ${({ borderlessMedia }) =>
      borderlessMedia &&
      css`
        box-shadow: none;
      `}
    pointer-events: none;
  }
`;
const CardTitle = styled.h4`
  ${truncated}
  padding: 1rem 0rem;
`;
export const CardWrapper = styled.article`
  display: grid;
  grid-gap: ${glsp(1)};
  ${({ expanded }) => {
    if (expanded) {
      return css`
        grid-template-columns: 1fr;
        grid-template-rows: 3fr 1fr 3fr;
      `;
    } else {
      return css`
        grid-template-columns: 1fr 4fr;
        grid-template-rows: auto 4fr;

        ${CardMedia} {
          grid-row: 1 / -1;
        }
        ${CardTitle} {
          grid-row: 1;
        }
        ol {
          grid-row: 2;
        }
      `;
    }
  }}

  ${({ size }) => {
    if (size == 'large') {
      return css`
        height: 12rem;
      `;
    } else if (size == 'small') {
      return css`
        height: 3.5rem;
      `;
    }
  }}




  padding: 0.5rem;
  border: 1px solid ${themeVal('color.baseAlphaC')};
  border-radius: ${themeVal('shape.rounded')};

  box-shadow: 0 0 16px 2px ${themeVal('color.baseAlphaA')},
    0 8px 24px -16px ${themeVal('color.baseAlphaB')};

  cursor: pointer;
  transition: all 0.16s ease 0s;
  &:hover {
    box-shadow: 0 0 16px 4px ${themeVal('color.baseAlphaA')},
      0 8px 24px -8px ${themeVal('color.baseAlphaB')};
    transform: translate(0, -0.125rem);
  }
`;

export const Card = ({
  id,
  title,
  size,
  onClick,
  borderlessMedia,
  cardMedia,
  details,
  expanded,
}) => {
  return (
    <CardWrapper id={id} size={size} onClick={onClick} expanded={expanded}>
      {cardMedia && (
        <CardMedia borderlessMedia={borderlessMedia}>{cardMedia}</CardMedia>
      )}
      <CardTitle>{title}</CardTitle>
      {details && <DetailsList details={details} />}
    </CardWrapper>
  );
};

Card.propTypes = {
  id: T.oneOfType([T.number, T.string]),
  title: T.string,
  size: T.oneOf(['small', 'large']),
  onClick: T.func,
  borderlessMedia: T.bool,
  cardMedia: T.node,
  details: T.object,
  expanded: T.bool,
};

const CardListContainer = styled.ol`
  display: grid;
  grid-template-columns: ${({ numColumns }) => {
    if (numColumns) {
      return css`repeat(${numColumns}, 1fr)`;
    } else {
      return css`repeat(auto-fit, minmax(16rem, 1fr))`;
    }
  }};
  gap: 2rem;
`;
const CardListScroll = styled(ShadowScrollbar)`
  flex: 1;
`;
const CardListWrapper = styled(PanelBlockBody)`
  height: 100%;
  ${({ nonScrolling }) =>
    nonScrolling &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: center;
    `}
`;

function CardList({
  data,
  renderCard,
  filterCard = () => true,
  numColumns,
  nonScrolling,
  style,
}) {
  return (
    <CardListWrapper style={style} nonScrolling={nonScrolling}>
      {nonScrolling ? (
        <CardListContainer numColumns={numColumns} className='list-container'>
          {data.filter(filterCard).map(renderCard)}
        </CardListContainer>
      ) : (
        <CardListScroll>
          <CardListContainer numColumns={numColumns} className='list-container'>
            {data.filter(filterCard).map(renderCard)}
          </CardListContainer>
        </CardListScroll>
      )}
    </CardListWrapper>
  );
}

CardList.propTypes = {
  data: T.array,
  renderCard: T.func.isRequired,
  filterCard: T.func,
  numColumns: T.number,
  nonScrolling: T.bool,
  style: T.object,
};

export default CardList;
