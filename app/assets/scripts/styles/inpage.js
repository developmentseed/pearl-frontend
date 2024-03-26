import styled, { css } from 'styled-components';

import {
  visuallyHidden,
  truncated,
  themeVal,
  glsp,
  rgba,
  media,
} from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';

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

  ${({ isMapCentric }) =>
    isMapCentric &&
    css`
      grid-template-rows: 1fr;
      ${InpageHeader} {
        ${visuallyHidden()}
      }
    `}
`;

export const InpageHeader = styled.header`
  /* Visually hidden */
  ${({ isHidden }) =>
    isHidden &&
    css`
      ${visuallyHidden()}
    `}
`;

export const InpageHeaderInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  padding: ${glsp(2)} ${glsp()};
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;
  ${media.mediumUp`
    padding: ${glsp(2)};
  `}
`;

export const InpageHeadline = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 100%;

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const InpageToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  > * ~ * {
    margin-left: ${glsp()};
  }
  ${media.mediumUp`
    padding-left: ${glsp(2)};
    margin-left: auto;
  `}
`;

export const InpageTitleWrapper = styled.div`
  display: flex;
  min-width: 0;
  flex-flow: column nowrap;
  margin-bottom: ${glsp(1.5)};
  ${media.mediumUp`
    /* padding: ${glsp(4)}; */
    flex-flow: row nowrap;
  `}
`;

export const InpageTitle = styled.h1`
  /* ${truncated()} */
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 0;
`;

export const InpageTagline = styled.p`
  ${headingAlt()}
  order: -1;
  font-size: 0.875rem;
  line-height: 1rem;
  color: ${rgba('#FFFFFF', 0.64)};
`;

export const InpageBody = styled.div`
  background: transparent;
`;

export const InpageBodyInner = styled.div`
  padding: ${glsp()};
  padding-top: 0;
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;
  ${media.mediumUp`
    padding: ${glsp(2)};
  `}
`;
