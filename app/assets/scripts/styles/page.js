import { reveal } from './animation';

import styled from 'styled-components';
export const Page = styled.div`
  display: grid;
  grid-template-rows: minmax(2rem, min-content) 1fr ${({ hideFooter }) =>
      hideFooter ? 0 : 'auto'};
  min-height: 100vh;
`;

export const PageBody = styled.main`
  padding: 0;
  margin: 0;

  /* Animation */
  animation: ${reveal} 0.48s ease 0s 1;
`;
