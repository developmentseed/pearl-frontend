import styled, { css } from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

export const HeadOptionHeadline = styled.div`
  grid-column: 1 / -1;
  ${({ usePadding }) =>
    usePadding &&
    css`
      padding: ${glsp(0)} ${glsp(1.5)};
    `}
`;

export const HeadOptionToolbar = styled.div`
  display: grid;
  justify-self: end;
  grid-template-columns: repeat(auto-fill, minmax(1rem, 1fr));
  gap: 1rem;
  grid-auto-flow: column;
  justify-items: center;
  align-self: flex-start;
  padding-right: ${glsp(1.5)};
`;

export const HeadOption = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) min-content;
  gap: 0.5rem;
  &:not(:last-of-type) {
    box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaC')};
    padding-bottom: 0.75rem;
  }
  ${({ hasSubtitle }) =>
    hasSubtitle &&
    css`
      ${HeadOptionToolbar} {
        grid-row: 2;
        grid-column: 2;
      }

      h1.subtitle {
        grid-column: 1;
        margin: 0;
      }
    `}
`;
