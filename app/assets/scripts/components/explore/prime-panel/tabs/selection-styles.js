import styled, { css } from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import {
  HeadOption as BaseHeadOption,
  HeadOptionToolbar,
} from '../../../../styles/panel';

export const Option = styled.div`
  display: grid;
  cursor: pointer;
  background: ${themeVal('color.baseDark')};
  padding: ${glsp(0.5)} 0;

  h1 {
    margin: 0;
    padding-left: ${glsp()};
  }


  ${({ hasSubtitle }) =>
    hasSubtitle &&
    css`
      .subtitle {
        margin: 0;
      }
    `}
  ${({ selected }) =>
    selected &&
    css`
      h1 {
        color: ${themeVal('color.primary')};
        border-left: ${glsp(0.25)} solid ${themeVal('color.primary')};
        padding-left: ${glsp(0.75)};
      }
      background: ${themeVal('color.primaryAlphaA')};
    `}

    ${({ selected }) =>
      !selected &&
      css`
        &:hover {
          background: ${themeVal('color.baseAlphaC')};
        }
      `}
  }
`;
export const HeadOption = styled(BaseHeadOption)`
  grid-template-columns: auto;
  grid-gap: 0;
  ${HeadOptionToolbar} {
    grid-row: auto;
    grid-column: auto;
  }
`;
