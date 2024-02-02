import { css } from 'styled-components';
import collecticon from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';

const thumbStyles = ` height: 2rem;
width: 2rem;
border: none;
border-radius: 100%;
position: relative;
cursor: pointer;
background-size: 50%;
background-position: center;
background-repeat: no-repeat;`;

export default () => css`
  .leaflet-geosearch-button.active .leaflet-bar-part.leaflet-bar-part-single {
    width: 30px;
  }

  .leaflet-control-attribution {
    a,
    a:visited {
      color: ${themeVal('color.baseDark')};
    }
  }

  .leaflet-control-geosearch {
    & form {
      border-radius: 4px;
      color: ${themeVal('color.base')};
      background: ${themeVal('color.surface')};
      input {
        color: ${themeVal('color.base')};
        background: ${themeVal('color.surface')};
      }
    }
    .results,
    .results.active {
      color: ${themeVal('color.base')};
      background: ${themeVal('color.surface')};
      > :hover {
        background: ${themeVal('color.primaryAlphaA')};
      }
    }
    & a.reset {
      color: ${themeVal('color.base')};
      background: ${themeVal('color.surface')};
      &:hover {
        background: inherit;
        color: ${themeVal('color.primary')};
      }
    }
    & a.leaflet-bar-part::before {
      content: none;
    }
    & a.leaflet-bar-part.leaflet-bar-part-single::after {
      ${collecticon('magnifier-left')};
      top: unset;
      left: unset;
      height: 100%;
      width: 100%;
      border-radius: unset;
      border: unset;
    }
  }

  .leaflet-bar a,
  .leaflet-bar a:hover {
    color: ${themeVal('color.base')};
    background: ${themeVal('color.surface')};
    opacity: 1;
    &.leaflet-disabled {
      background: #5d5c66;
    }
  }

  .leaflet-control.leaflet-bar a.centerMap::after {
    ${collecticon('crosshair-2')};
  }

  .leaflet-top.leaflet-left {
    .leaflet-control {
      box-shadow: 0 -1px 1px 0 rgba(68, 63, 63, 0.08),
        0 2px 6px 0 rgba(68, 63, 63, 0.16);
      border: none;
      border-radius: 0.25rem;
    }
  }

  #layer-control.leaflet-control.generic-leaflet-control {
    background: ${themeVal('color.surface')};
    line-height: 30px;
    text-align: center;
  }
  #layer-control.leaflet-control.generic-leaflet-control {
    cursor: pointer;
  }
  #layer-control.leaflet-control.generic-leaflet-control::after {
    ${collecticon('iso-stack')};
    color: ${themeVal('color.base')};
    top: unset;
    left: unset;
    height: 100%;
    width: 100%;
    border-radius: unset;
    border: unset;
  }
  .leaflet-control-scale-line {
    background: rgba(255, 255, 255, 0.75);
  }

  .leaflet-div-icon.leaflet-editing-icon.leaflet-edit-move.leaflet-interactive,
  .leaflet-div-icon.leaflet-editing-icon.leaflet-edit-resize.leaflet-interactive {
    cursor: crosshair;
  }
  .leaflet-sbs-divider {
    background-color: ${themeVal('color.background')};
  }
  .leaflet-sbs-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -14px;
    background: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.999 16H9.001V0H6.999V16ZM5.414 5.414L4 4L0 8L4 12L5.414 10.586L3.828 9H6V7H3.828L5.414 5.414ZM10.586 5.414L12 4L16 8L12 12L10.586 10.586L12.172 9H10V7H12.172L10.586 5.414Z' fill='%23F0F4FF'/%3E%3C/svg%3E"),
      ${themeVal('color.background')};
    ${thumbStyles};
  }

  /* All the same stuff for Firefox */
  input[type='range']::-moz-range-thumb {
    background: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.999 16H9.001V0H6.999V16ZM5.414 5.414L4 4L0 8L4 12L5.414 10.586L3.828 9H6V7H3.828L5.414 5.414ZM10.586 5.414L12 4L16 8L12 12L10.586 10.586L12.172 9H10V7H12.172L10.586 5.414Z' fill='%23F0F4FF'/%3E%3C/svg%3E"),
      ${themeVal('color.background')};
    ${thumbStyles};
  }

  /* All the same stuff for IE */
  input[type='range']::-ms-thumb {
    background: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.999 16H9.001V0H6.999V16ZM5.414 5.414L4 4L0 8L4 12L5.414 10.586L3.828 9H6V7H3.828L5.414 5.414ZM10.586 5.414L12 4L16 8L12 12L10.586 10.586L12.172 9H10V7H12.172L10.586 5.414Z' fill='%23F0F4FF'/%3E%3C/svg%3E"),
      ${themeVal('color.background')};
    ${thumbStyles};
  }
`;
