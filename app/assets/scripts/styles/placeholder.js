import styled from 'styled-components';
import Prose from './type/prose';

export const PlaceholderMessage = styled(Prose)`
  font-weight: 350;
  text-align: center;
`;

export const GlobalLoadingMessage = styled.div`
  text-align: center;
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;
