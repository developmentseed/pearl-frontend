import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

/*
 * Styled buttons
 */
export const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  hideText: true,
})`
  opacity: 50%;
  width: min-content;
`;
