import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { themeVal, stylizeFunction } from '../utils/general';

const _rgba = stylizeFunction(rgba);

const sizeMapping = {
  xsmall: '0.75rem',
  small: '0.875rem',
  medium: '1rem',
  large: '1.25rem',
  xlarge: '1.5rem'
};

const lineHeightMapping = {
  xsmall: '1rem',
  small: '1.25rem',
  medium: '1.5rem',
  large: '1.75rem',
  xlarge: '2rem'
};

const Heading = styled.h1`
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.weight')};
  margin: 0;

  /* Size and line-height attribute */
  ${({ size }) => `
    font-size: ${sizeMapping[size]};
    line-height: ${lineHeightMapping[size]};
  `}
`;

Heading.defaultProps = {
  size: 'medium'
};

export default Heading;

export const Subheading = styled.h2`
  color: ${_rgba(themeVal('type.base.color'), 0.64)};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-feature-settings: "pnum" 0; /* Use proportional numbers */
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.regular')};
  text-transform: uppercase;
`;

export const headingAlt = () => css`
  opacity: 0.64;
  color: inherit;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-feature-settings: "pnum" 0; /* Use proportional numbers */
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.regular')};
  text-transform: uppercase;
`;
