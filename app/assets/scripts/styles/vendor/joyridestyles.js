import { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

export default () => css`
  /* Overrides for joyride styles. */
  .__floater__arrow {
    svg polygon {
      fill: ${themeVal('color.background')};
    }
  }
`;
