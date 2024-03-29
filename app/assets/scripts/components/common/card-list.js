import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Heading as CardSubtitle } from '@devseed-ui/typography';
import { truncated, themeVal, glsp } from '@devseed-ui/theme-provider';

import ShadowScrollbar from '../common/shadow-scrollbar';
import { PanelBlockBody } from '../common/panel-block';
import DetailsList from './details-list';

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
  img {
    max-width: 100%;
  }
`;
const CardTitle = styled.h4`
  ${truncated}
  &:hover {
    ${({ onClick }) =>
      onClick &&
      css`
        color: ${themeVal('color.primary')};
      `}
  }
`;

export const CardWrapper = styled.article`
  display: grid;
  grid-gap: ${glsp(1)};
  ${({ expanded, cardMedia }) => {
    if (expanded) {
      return css`
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: 2fr minmax(0, 1fr) 2fr;
      `;
    } else if (cardMedia) {
      return css`
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto 4fr;
        ${CardMedia} {
          grid-row: 1 / -1;
        }
      `;
    } else {
      return css`
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
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
        min-height: 12rem;
      `;
    } else if (size == 'small') {
      return css`
        height: 3.5rem;
      `;
    }
  }}

  padding: 1rem;
  border: 1px solid ${themeVal('color.baseAlphaC')};
  border-color: ${({ selected }) => selected && themeVal('color.primary')};
  border-radius: ${themeVal('shape.rounded')};

  box-shadow: 0 0 16px 2px ${themeVal('color.baseDarkAlphaA')},
    0 8px 24px -16px ${themeVal('color.baseDarkAlphaB')};

  cursor: pointer;
  transition: all 0.16s ease 0s;
  &:hover {
    ${({ hoverTransform }) =>
      hoverTransform
        ? css`
            transform: translate(0, -0.125rem);
            box-shadow: 0 0 16px 4px ${themeVal('color.baseDarkAlphaA')},
              0 8px 24px -8px ${themeVal('color.baseDarkAlphaB')};
          `
        : css`
            box-shadow: 0 0 16px 4px ${themeVal('color.baseDarkAlphaB')},
              0 8px 24px -8px ${themeVal('color.baseDarkAlphaC')};
          `}
  }
  > header > ${CardSubtitle} {
    margin: 0;
    margin-top: ${glsp(0.5)};
  }
`;

export const Card = (props) => {
  const {
    id,
    title,
    subtitle,
    size,
    onClick,
    borderlessMedia,
    cardMedia,
    details,
    expanded,
    hoverTransform,
    selected,
  } = props;
  return (
    <CardWrapper
      id={id}
      data-cy={props['data-cy']}
      size={size}
      onClick={onClick}
      expanded={expanded}
      cardMedia={cardMedia}
      hoverTransform={hoverTransform}
      selected={selected}
    >
      {cardMedia && (
        <CardMedia borderlessMedia={borderlessMedia}>{cardMedia}</CardMedia>
      )}
      <header>
        <CardTitle onClick={onClick}>{title}</CardTitle>
        {subtitle && (
          <CardSubtitle size='xsmall' useAlt as='p'>
            {subtitle}
          </CardSubtitle>
        )}
      </header>
      {details && <DetailsList details={details} />}
    </CardWrapper>
  );
};

Card.propTypes = {
  id: T.oneOfType([T.number, T.string]),
  'data-cy': T.string,
  title: T.string,
  subtitle: T.string,
  size: T.oneOf(['small', 'large']),
  onClick: T.func,
  borderlessMedia: T.bool,
  cardMedia: T.node,
  details: T.object,
  expanded: T.bool,
  hoverTransform: T.bool,
  selected: T.bool,
};

const CardListContainer = styled.ol`
  display: grid;
  height: min-content;
  grid-template-columns: ${({ numColumns }) => {
    if (numColumns) {
      return css`repeat(${numColumns}, 1fr)`;
    } else {
      return css`repeat(auto-fit, minmax(16rem, 1fr))`;
    }
  }};
  gap: 1rem;
`;
const CardListScroll = styled(ShadowScrollbar)`
  flex: 1;
`;
const CardListWrapper = styled(PanelBlockBody)`
  height: min-content;
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
  const cards = data.filter(filterCard);
  return (
    <CardListWrapper style={style} nonScrolling={nonScrolling}>
      {nonScrolling ? (
        <CardListContainer numColumns={numColumns} className='list-container'>
          {cards.length ? cards.map(renderCard) : 'No results found'}
        </CardListContainer>
      ) : (
        <CardListScroll>
          <CardListContainer numColumns={numColumns} className='list-container'>
            {cards.length ? cards.map(renderCard) : 'No results found'}
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
