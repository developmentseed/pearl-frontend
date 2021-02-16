import { createGlobalStyle } from 'styled-components';
import { collecticonsFont } from './collecticons';
import leafletStyles from './vendor/leaflet';
import reactToastStyles from './vendor/react-toastify';

export default createGlobalStyle`
  ${collecticonsFont()};
  ${leafletStyles()};
  ${reactToastStyles()};
`;
