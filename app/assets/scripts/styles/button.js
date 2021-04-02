import styled from 'styled-components';

import { InfoButton } from '../components/common/info-button';

/*
 * Styled buttons
 */
export const EditButton = styled(InfoButton).attrs({
  variation: 'base-plain',
  size: 'small',
  hideText: true,
})`
  opacity: 50%;
  width: min-content;
`;
