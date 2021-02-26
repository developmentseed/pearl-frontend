import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { convertArea } from '@turf/helpers';
import tArea from '@turf/area';
import tBboxPolygon from '@turf/bbox-polygon';
import SizeAwareElement from '../../common/size-aware-element';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { ExploreContext, viewModes } from '../../../context/explore';
import GeoCoder from '../../common/map/geocoder';
import { themeVal, multiply } from '@devseed-ui/theme-provider';
import FreeDraw, { ALL } from 'leaflet-freedraw';
import AoiDrawControl from './aoi-draw-control';
import AoiEditControl from './aoi-edit-control';

const center = [38.942, -95.449];
const zoom = 4;
const freeDraw = new FreeDraw({
  mode: ALL,
});

const Container = styled.div`
  height: 100%;
  z-index: 1;

  .leaflet-draw-toolbar,
  .leaflet-draw-actions {
    visibility: hidden;
  }

  .leaflet-top.leaflet-left {
    /* Shift control container vertically */
    top: 7.5vh;
    .leaflet-geosearch-button.active form {
      /* CSS quirk to make input box the right height */
      line-height: 2.5;
    }
    .leaflet-control {
      margin-left: ${multiply(themeVal('layout.space'), 0.5)};
    }

    .leaflet-control.leaflet-draw {
      box-shadow: none;
    }
  }
`;

/**
 * Get area from bbox
 *
 * @param {array} bbox extent in minX, minY, maxX, maxY order
 */
function areaFromBounds(bbox) {
  const poly = tBboxPolygon(bbox);
  return convertArea(tArea(poly), 'meters', 'kilometers');
}

function Map() {
  const [map, setMap] = useState(null);
  const {
    viewMode,
    previousViewMode,
    setViewMode,
    aoi,
    setAoi,
    setAoiArea,
  } = useContext(ExploreContext);

  useEffect(() => {
    if (previousViewMode === viewModes.EDIT_CLASS_MODE) {
      map.removeLayer(freeDraw);
    }

    switch (viewMode) {
      case viewModes.CREATE_AOI_MODE:
        map.aoi.control.draw.enable();
        break;
      case viewModes.EDIT_AOI_MODE:
        map.aoi.control.draw.disable();
        map.aoi.control.edit.enable(aoi);
        break;
      case viewModes.EDIT_CLASS_MODE:
        map.aoi.control.edit.disable(aoi);
        map.addLayer(freeDraw);
        break;
      default:
        break;
    }
  }, [viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%' }}
        whenCreated={(m) => {
          // Setup AOI controllers
          m.aoi = {
            control: {},
          };
          m.aoi.control.draw = new AoiDrawControl(m, {
            onDrawChange: (bbox) => {
              setAoiArea(areaFromBounds(bbox));
            },
            onDrawEnd: (shape) => {
              setAoi(shape);
              setViewMode(viewModes.EDIT_AOI_MODE);
            },
          });
          m.aoi.control.edit = new AoiEditControl(m, (bounds) => {
            setAoiArea(areaFromBounds(bounds));
          });

          // Add map to state
          setMap(m);

          if (process.env.NODE_ENV !== 'production') {
            // makes map accessible in console for debugging
            window.map = m;
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <FeatureGroup>
          <GeoCoder />
        </FeatureGroup>
      </MapContainer>
    ),
    [viewMode] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <SizeAwareElement
      element={Container}
      id='map'
      data-cy='leaflet-map'
      onChange={() => {
        if (map) {
          map.invalidateSize();
        }
      }}
    >
      {displayMap}
    </SizeAwareElement>
  );
}

export default Map;
