import { createGlobalStyle } from 'styled-components';
import { collecticonsFont } from './collecticons';
import reactToastStyles from './vendor/react-toastify';

export default createGlobalStyle`
  ${collecticonsFont()}
  ${reactToastStyles()}
`;
