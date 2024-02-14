import { css } from 'styled-components';
import collecticon from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';

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
  #compare-viewmode.leaflet-control.generic-leaflet-control {
    background: ${themeVal('color.surface')};
    line-height: 30px;
    text-align: center;
  }
  #compare-viewmode.leaflet-control.generic-leaflet-control {
    cursor: pointer;
  }
  #compare-viewmode.leaflet-control.generic-leaflet-control::after {
    ${collecticon('resize-center-horizontal')};
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
`;
