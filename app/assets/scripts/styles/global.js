import { createGlobalStyle } from 'styled-components';

import { collecticonsFont } from './collecticons';
import leafletStyles from './vendor/leaflet';

export default createGlobalStyle`
  ${collecticonsFont()}
  ${leafletStyles()};
`;
