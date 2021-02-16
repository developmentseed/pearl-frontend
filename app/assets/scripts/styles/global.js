import { createGlobalStyle } from 'styled-components';
import { collecticonsFont } from './collecticons';
import leafletStyles from './vendor/leaflet';
import reactToastStyles from './vendor/react-toastify';
import devseedUiStyles from './vendor/devseed';

export default createGlobalStyle`
  ${collecticonsFont()};
  ${leafletStyles()};
  ${reactToastStyles()};
  ${devseedUiStyles()};

`;
