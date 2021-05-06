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
    font-size: 0.875rem;
  }
  h1 {
    margin: 0;
    overflow-wrap: break-word;
    overflow-wrap: anywhere;
  }
`;

export const DropdownBody = styled.ul`
  display: grid;
  grid-gap: ${glsp(0.5)};
  padding: ${glsp(0.5)} 0;
  overflow: auto;
`;
export const DropdownItem = styled.a`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: start;
  padding: ${glsp(0.25)} ${glsp()};
  grid-gap: ${glsp()};
  font-weight: ${themeVal('type.heading.weight')};
  color: ${themeVal('color.base')};
  transition: all 0.16s ease-in-out;
  overflow-wrap: break-word;
  overflow-wrap: anywhere;

  ${({ useIcon }) =>
    useIcon &&
    css`
      grid-template-columns: max-content 1fr;
      ::before {
        ${collecticon(useIcon)}
      }
    `}

  /* Add a tick if checked, may conflict with useIcon */
  ${({ checked }) =>
    checked &&
    css`
      grid-template-columns: max-content 1fr;
      ::before {
        ${collecticon('tick')}
      }
    `}

  :visited {
    color: ${themeVal('color.base')};
  }
  :hover {
    opacity: 1;
  }
  ${({ nonhoverable }) =>
    !nonhoverable &&
    css`
      :hover {
        color: ${themeVal('color.primary')};
        background: ${themeVal('color.primaryAlphaA')};
      }
    `}

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
  background: ${themeVal('color.background')};
  color: ${themeVal('color.base')};
  max-width: 18rem;
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaB')},
    0 0 32px 2px ${themeVal('color.baseDarkAlphaD')},
    0 16px 48px -16px ${themeVal('color.baseDarkAlphaE')};
`;
export const DropdownTrigger = styled(InfoButton)`
  &::before {
    ${({ usePreIcon }) => usePreIcon && collecticon(usePreIcon)}
    font-size: ${multiply(themeVal('type.base.size'), 0.85)};
  }
`;
