import styled, { css } from 'styled-components';
import { rgba } from 'polished';

import { visuallyHidden, truncated } from './helpers';
import { themeVal, stylizeFunction } from './utils/general';
import { multiply } from './utils/math';
import { headingAlt } from './type/heading';

const _rgba = stylizeFunction(rgba);

export const Inpage = styled.article`
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr;

  /**
   * Make Inpage map-centric
   *
   * Vizually hides inpageHeader and sets the grid layout to a single row.
   * The latter is needed so that inpageBody can be displayed in full height.
   */

  ${({ isMapCentric }) => isMapCentric &&
   css`
      grid-template-rows: 1fr;
      ${InpageHeader} {
        ${visuallyHidden()}
      }
    `}
`;

export const InpageHeader = styled.header`
  /* Visually hidden */
  ${({ isHidden }) => isHidden &&
   css`
      ${visuallyHidden()}
    `}
`;

export const InpageHeaderInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  padding: ${multiply(themeVal('layout.space'), 4)} ${multiply(themeVal('layout.space'), 4)} ${multiply(themeVal('layout.space'), 2)} ${multiply(themeVal('layout.space'), 4)};
  margin: 0 auto;
`;

export const InpageHeadline = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 0;

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const InpageToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding-left: ${multiply(themeVal('layout.space'), 2)};
  margin-left: auto;
`;

export const InpageTitleWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  min-width: 0;
  margin-bottom: ${multiply(themeVal('layout.space'), 1.5)};
`;

export const InpageTitle = styled.h1`
  ${truncated()}
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 0;
`;

export const InpageTagline = styled.p`
  ${headingAlt()}
  order: -1;
  font-size: 0.875rem;
  line-height: 1rem;
  color: ${_rgba('#FFFFFF', 0.64)};
`;

export const InpageBody = styled.div`
  background: transparent;
`;

export const InpageBodyInner = styled.div`
  padding: 0 ${multiply(themeVal('layout.space'), 4)} ${multiply(themeVal('layout.space'), 4)} ${multiply(themeVal('layout.space'), 4)};
  max-width: ${themeVal('layout.max')};
`;
