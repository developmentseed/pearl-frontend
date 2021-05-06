import styled from 'styled-components';
import Prose from './type/prose';
import { themeVal } from '@devseed-ui/theme-provider';

export const PlaceholderMessage = styled(Prose)`
  font-weight: 350;
  text-align: center;
  color: ${themeVal('color.base')};
`;
