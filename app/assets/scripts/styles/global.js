import { createGlobalStyle } from 'styled-components';
import { collecticonsFont } from './collecticons';
import leafletStyles from './vendor/leaflet';
import reactToastStyles from './vendor/react-toastify';
import inputRangeStyles from './vendor/react-input-range';
import joyrideStyles from './vendor/joyridestyles';

export default createGlobalStyle`
  ${collecticonsFont()};
  ${leafletStyles()};
  ${reactToastStyles()};
  ${inputRangeStyles()};
  ${joyrideStyles()};
`;
