import styled from 'styled-components';

import { InfoButton } from '../components/common/info-button';

// TODO This button name is not used on edit only and should be replaced by
// the Action Button
export const EditButton = styled(InfoButton).attrs({
  variation: 'base-plain',
  size: 'small',
  hideText: true,
})`
  opacity: 80%;
  width: min-content;
`;

export const ActionButton = styled(InfoButton).attrs({
  variation: 'base-plain',
  size: 'small',
  hideText: true,
})`
  opacity: 80%;
  width: min-content;
`;
