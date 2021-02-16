import styled from 'styled-components';
import { rgba } from 'polished';
import { themeVal, stylizeFunction } from '../utils/general';

const _rgba = stylizeFunction(rgba);

export const Subheading = styled.h2`
  color: ${_rgba(themeVal('type.base.color'), 0.64)};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-feature-settings: 'pnum' 0; /* Use proportional numbers */
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.regular')};
  text-transform: uppercase;
`;
