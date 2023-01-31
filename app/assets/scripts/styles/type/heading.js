import styled, { css } from 'styled-components';
import { themeVal, rgba, glsp, truncated } from '@devseed-ui/theme-provider';
import collecticon from '../collecticons';

export const Subheading = styled.h2`
  color: ${rgba(themeVal('color.base'), 0.72)};
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.5px;
  font-feature-settings: 'pnum' 0; /* Use proportional numbers */
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.regular')};
  text-transform: uppercase;
`;

export const SubheadingStrong = styled.h3`
  color: ${themeVal('color.base')};
  font-weight: ${themeVal('type.heading.weight')};
  font-size: ${themeVal('type.base.size')};
  line-height: 1.5rem;
  padding-left: ${glsp(1.5)};
  ${truncated}

  ${({ useIcon }) =>
    useIcon &&
    css`
      display: grid;
      grid-template-columns: max-content max-content;
      grid-gap: 1rem;
      &::after {
        ${collecticon(useIcon)}
      }
    `}
  ${({ onClick, disabled }) =>
    onClick &&
    !disabled &&
    css`
      transition: opacity 0.24s ease 0s;
      &:hover {
        cursor: pointer;
        opacity: 0.64;
      }
    `}
`;
