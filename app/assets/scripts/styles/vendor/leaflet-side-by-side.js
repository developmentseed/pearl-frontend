import { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

const thumbStyles = ` height: 3rem;
width: 3rem;
border: none;
margin: 0;
padding: 0;
border-radius: 100%;
border: 4px solid #121826;
backdrop-filter: blur(5px);
position: relative;
pointer-events: auto;
cursor: ew-resize;
background-size: 50% 50%;
background-position: center;
background-repeat: no-repeat;
`;

export default () => css`
  .leaflet-sbs-range {
    position: absolute;
    top: 50%;
    width: 100%;
    z-index: 999;
    -webkit-appearance: none;
    display: inline-block !important;
    vertical-align: middle;
    height: 0;
    padding: 0;
    margin: 0;
    border: 0;
    background: rgba(0, 0, 0, 0.25);
    min-width: 100px;
    cursor: pointer;
    pointer-events: none;
  }

  .leaflet-sbs-divider {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -2px;
    width: 4px;
    background-color: ${themeVal('color.background')};
    pointer-events: none;
    z-index: 999;
  }

  .leaflet-sbs-range::-ms-fill-upper {
    background: transparent;
  }
  .leaflet-sbs-range::-ms-fill-lower {
    background: rgba(255, 255, 255, 0.25);
  }
  /* Browser thingies */

  .leaflet-sbs-range::-moz-range-track {
    opacity: 0;
  }
  .leaflet-sbs-range::-ms-track {
    opacity: 0;
  }
  .leaflet-sbs-range::-ms-tooltip {
    display: none;
  }
  /* For whatever reason, these need to be defined
* on their own so dont group them */

  .leaflet-sbs-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -14px;
    background: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.999 16H9.001V0H6.999V16ZM5.414 5.414L4 4L0 8L4 12L5.414 10.586L3.828 9H6V7H3.828L5.414 5.414ZM10.586 5.414L12 4L16 8L12 12L10.586 10.586L12.172 9H10V7H12.172L10.586 5.414Z' fill='%23121826'/%3E%3C/svg%3E"),
      transparent;
    ${thumbStyles};
  }
  .leaflet-sbs-range::-ms-thumb {
    background: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.999 16H9.001V0H6.999V16ZM5.414 5.414L4 4L0 8L4 12L5.414 10.586L3.828 9H6V7H3.828L5.414 5.414ZM10.586 5.414L12 4L16 8L12 12L10.586 10.586L12.172 9H10V7H12.172L10.586 5.414Z' fill='%23121826'/%3E%3C/svg%3E"),
      transparent;
    ${thumbStyles};
  }
  .leaflet-sbs-range::-moz-range-thumb {
    right: 0;
    background: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.999 16H9.001V0H6.999V16ZM5.414 5.414L4 4L0 8L4 12L5.414 10.586L3.828 9H6V7H3.828L5.414 5.414ZM10.586 5.414L12 4L16 8L12 12L10.586 10.586L12.172 9H10V7H12.172L10.586 5.414Z' fill='%23121826'/%3E%3C/svg%3E"),
      transparent;
    ${thumbStyles};
  }
  .leaflet-sbs-range:disabled::-moz-range-thumb {
    cursor: default;
  }
  .leaflet-sbs-range:disabled::-ms-thumb {
    cursor: default;
  }
  .leaflet-sbs-range:disabled::-webkit-slider-thumb {
    cursor: default;
  }
  .leaflet-sbs-range:disabled {
    cursor: default;
  }
  .leaflet-sbs-range:focus {
    outline: none !important;
  }
  .leaflet-sbs-range::-moz-focus-outer {
    border: 0;
  }
`;
