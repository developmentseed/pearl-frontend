import React from 'react';
import styled, { css } from 'styled-components';
import ShadowScrollbar from '../common/shadow-scrollbar';
import { PanelBlockBody } from '../common/panel-block';
import T from 'prop-types';

import { truncated, themeVal } from '@devseed-ui/theme-provider';

export const CardWrapper = styled.article`
  height: ${({ size }) => (size === 'large' ? '5rem' : '3.5rem')};
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
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

const CardMedia = styled.figure`
  display: flex;
  margin: 0.5rem;
  margin-right: 0;
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
const CardIcon = styled.img`
  width: 3rem;
`;
const CardTitle = styled.h4`
  ${truncated}
  padding: 1rem;
`;

export const Card = ({
  id,
  title,
  iconPath,
  size,
  onClick,
  borderlessMedia,
}) => {
  return (
    <CardWrapper id={id} size={size} onClick={onClick}>
      {iconPath && (
        <CardMedia borderlessMedia={borderlessMedia}>
          <CardIcon src={iconPath} />
        </CardMedia>
      )}
      <CardTitle>{title}</CardTitle>
    </CardWrapper>
  );
};

Card.propTypes = {
  id: T.string,
  title: T.string,
  iconPath: T.string,
  size: T.oneOf(['small', 'large']),
  onClick: T.func,
  borderlessMedia: T.bool,
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
  padding: 1rem 1rem 1rem 0;
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
}) {
  return (
    <CardListWrapper nonScrolling={nonScrolling}>
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
  renderCard: T.func,
  filterCard: T.func,
  numColumns: T.number,
  nonScrolling: T.bool,
};

export default CardList;
