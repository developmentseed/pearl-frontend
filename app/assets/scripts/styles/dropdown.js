import styled, { css } from 'styled-components';
import { themeVal, multiply } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';
import BaseDropdown from '@devseed-ui/dropdown';
import InfoButton from '../components/common/info-button';

export const DropdownHeader = styled.header`
  ${({ unshaded }) =>
    !unshaded &&
    css`
      background: ${themeVal('color.baseAlphaB')};
    `}
  background: ${themeVal('color.baseAlphaB')};
  display: grid;
  padding: ${multiply(themeVal('layout.space'), 0.5)}
    ${themeVal('layout.space')};
  p {
    text-transform: uppercase;
    font-size: ${multiply(themeVal('type.base.size'), 0.75)};
  }
  h1 {
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
  grid-template-columns: max-content max-content;
  justify-items: start;
  padding: ${multiply(themeVal('layout.space'), 0.25)}
    ${themeVal('layout.space')};
  grid-gap: ${themeVal('layout.space')};
  font-weight: ${themeVal('type.heading.weight')};
  color: ${themeVal('color.base')};
  transition: all 0.16s ease-in-out;
  ::before {
    ${({ useIcon }) => useIcon && collecticon(useIcon)}
  }

  /* Add a tick if checked, may conflict with useIcon */
  ${({ checked }) =>
    checked &&
    css`
      ::before {
        ${collecticon('tick')}
      }
    `}

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
  padding: ${multiply(themeVal('layout.space'), 0.5)} 0;
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
