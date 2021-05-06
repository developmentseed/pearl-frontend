import { css } from 'styled-components';
import collecticon from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';

export default () => css`
  .leaflet-geosearch-button.active .leaflet-bar-part.leaflet-bar-part-single {
    width: 30px;
  }
  .leaflet-control-geosearch form {
    border-radius: 4px;
  }
  .leaflet-control-geosearch .reset {
    display: none;
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

  .leaflet-control-geosearch a.leaflet-bar-part::before {
    content: none;
  }

  .leaflet-control-geosearch a.leaflet-bar-part.leaflet-bar-part-single::after {
    ${collecticon('magnifier-left')};
    top: unset;
    left: unset;
    height: 100%;
    width: 100%;
    border-radius: unset;
    border: unset;
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
`;
