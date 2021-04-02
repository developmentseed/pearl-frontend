import styled, { css } from 'styled-components';
import { Button } from '@devseed-ui/button';
import localCollecticon from './collecticons/';

/*
 * Library button will use library collecticons by default
 * In order to use a local collection, use this component
 * Which overrides the application of useIcon with local collecticon catalog
*/
export const LocalButton = styled(Button)`
  ${({ useIcon }) => {
    if (!useIcon) return null;

    const [icon, position] = Array.isArray(useIcon)
      ? useIcon
      : [useIcon, 'before'];

    const selector = `&::${position}`;

    return css`
      ${selector} {
        ${localCollecticon(icon)}
      }
    `;
  }}
`;
