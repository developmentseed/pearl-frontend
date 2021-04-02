import styled, { css } from 'styled-components';
import { glsp, themeVal, multiply } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';
import BaseDropdown from '@devseed-ui/dropdown';
import InfoButton from '../components/common/info-button';

export const DropdownHeader = styled.header`
  background: ${({ unshaded }) =>
    unshaded ? 'none' : themeVal('color.baseAlphaB')};
  display: grid;
  padding: ${glsp()};
  p {
    text-transform: uppercase;
  }
  h1 {
    margin: 0;
  }
`;

export const DropdownBody = styled.ul`
  display: grid;
  grid-gap: ${glsp(0.5)};
  padding: ${glsp(0.5)} 0;
`;
export const DropdownItem = styled.a`
  display: grid;
  grid-template-columns: max-content max-content;
  justify-items: start;
  padding: ${glsp(0.25)} ${glsp()};
  grid-gap: ${glsp()};
  font-weight: ${themeVal('type.heading.weight')};
  color: ${themeVal('color.base')};
  transition: all 0.16s ease-in-out;
  ::before {
    ${({ useIcon }) => useIcon && collecticon(useIcon)}
  }

  :visited {
    color: ${themeVal('color.base')};
  }
  :hover {
    color: ${themeVal('color.primary')};
    opacity: 1;
    background: ${themeVal('color.primaryAlphaA')};
  }

  ${({ muted }) =>
    muted &&
    css`
      color: ${themeVal('color.baseAlphaD')};
    `}
`;
export const DropdownFooter = styled.footer`
  border-top: 1px solid ${themeVal('color.baseAlphaD')};
  padding: ${glsp(0.5)} 0;
`;

export const Dropdown = styled(BaseDropdown)`
  padding: 0;
`;
export const DropdownTrigger = styled(InfoButton)`
  &::before {
    ${({ usePreIcon }) => usePreIcon && collecticon(usePreIcon)}
    font-size: ${multiply(themeVal('type.base.size'), 0.85)};
  }
`;
