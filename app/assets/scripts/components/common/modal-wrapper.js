import { glsp } from '@devseed-ui/theme-provider';
import styled from 'styled-components';

export const ModalWrapper = styled.div`
  display: grid;
  grid-template-areas:
    'a a'
    'b c';
  grid-gap: ${glsp(1)};
  padding: ${glsp()};
  div {
    grid-area: a;
  }
`;
