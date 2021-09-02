import { css, createGlobalStyle } from 'styled-components';
import { collecticonsFont } from './collecticons';
import leafletStyles from './vendor/leaflet';
import reactToastStyles from './vendor/react-toastify';
import inputRangeStyles from './vendor/react-input-range';
import joyrideStyles from './vendor/joyridestyles';
import { themeVal, rgba } from '@devseed-ui/theme-provider';

const darkStyles = () => css`
  .modal {
    background: ${rgba(themeVal('color.background'), 0.7)} !important;
  }

  .modal__contents {
    box-shadow: 0 0 32px 2px ${themeVal('color.baseDarkAlphaB')},
      0 16px 48px -16px ${themeVal('color.baseDarkAlphaD')} !important;
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
