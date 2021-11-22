import { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

export default () => css`
  /* Overrides for joyride styles. */
  .__floater__arrow {
    svg polygon {
      fill: ${themeVal('color.surface')};
    }
  }
  .react-joyride__overlay {
    background-color: rgba(0, 0, 0, 0.625);
    position: absolute;
  }
  .react-joyride__spotlight {
    background-color: #8c8c8c;
    border: 1px solid ${themeVal('color.secondary')};
  }
`;
