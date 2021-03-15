import styled from 'styled-components';
import { themeVal, rgba } from '@devseed-ui/theme-provider';

export const Subheading = styled.h2`
  color: ${rgba(themeVal('type.base.color'), 0.64)};
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: 0.5px;
  font-feature-settings: 'pnum' 0; /* Use proportional numbers */
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.heading.regular')};
  text-transform: uppercase;
`;
