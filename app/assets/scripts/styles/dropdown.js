import styled from 'styled-components';
import { themeVal } from './utils/general';
import { multiply } from './utils/math';
import collecticon from '@devseed-ui/collecticons';

export const DropdownHeader = styled.header`
  background: ${themeVal('color.baseAlphaB')};
  display: grid;
  padding: ${multiply(themeVal('layout.space'), 0.5)}
    ${themeVal('layout.space')};
  p {
    text-transform: uppercase;
    font-size: ${multiply(themeVal('type.base.size'), 0.75)};
  }
  h1 {
    font-size: ${themeVal('type.base.size')};
    margin: 0;
  }
`;

export const DropdownBody = styled.ul`
  display: grid;
  grid-gap: ${multiply(themeVal('layout.space'), 0.5)};
  padding: ${multiply(themeVal('layout.space'), 0.5)} 0;
`;
export const DropdownItem = styled.a`
  display: grid;
  grid-template-columns: min-content max-content;
  justify-items: start;
  padding: ${multiply(themeVal('layout.space'), 0.25)}
    ${themeVal('layout.space')};
  grid-gap: ${themeVal('layout.space')};
  color: ${themeVal('color.base')};

  ::before {
    ${({ useIcon }) => useIcon && collecticon(useIcon)}
  }

  :hover {
    background: ${themeVal('color.baseAlphaD')};
  }
`;
export const DropdownFooter = styled.footer`
  border-top: 1px solid ${themeVal('color.baseAlphaD')};
  padding: ${multiply(themeVal('layout.space'), 0.5)} 0;
`;
