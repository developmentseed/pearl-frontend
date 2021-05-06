import { css, createGlobalStyle } from 'styled-components';
import { collecticonsFont } from './collecticons';
import leafletStyles from './vendor/leaflet';
import reactToastStyles from './vendor/react-toastify';
import inputRangeStyles from './vendor/react-input-range';
import joyrideStyles from './vendor/joyridestyles';
import { themeVal } from '@devseed-ui/theme-provider';

const darkStyles = () => css`
  .modal {
    background: ${themeVal('color.baseDarkAlphaC')} !important;
  }
  .modal__contents {
    box-shadow: 0 0 32px 2px ${themeVal('color.baseDarkAlphaB')},
      0 16px 48px -16px ${themeVal('color.baseDarkAlphaD')} !important;
  }
  [data-testid='global-loading'] {
    background: ${themeVal('color.silkDark')} !important;
  }
`;

export default createGlobalStyle`
  ${darkStyles()};
  ${collecticonsFont()};
  ${leafletStyles()};
  ${reactToastStyles()};
  ${inputRangeStyles()};
  ${joyrideStyles()};
`;
