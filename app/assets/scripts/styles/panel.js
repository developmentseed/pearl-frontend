import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

export const HeadOption = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content;
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaC')};
  gap: 0.25rem;
  padding-bottom: ${glsp(0.75)};
`;

export const HeadOptionHeadline = styled.div`
  grid-column: 1 / -1;
`;

export const HeadOptionToolbar = styled.div`
  display: grid;
  justify-self: end;
  grid-template-columns: repeat(auto-fill, minmax(1rem, 1fr));
  gap: 1rem;
  grid-auto-flow: column;
  justify-items: center;
  align-self: flex-start;
`;
