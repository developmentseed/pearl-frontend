import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { lineString as tLineString, convertArea } from '@turf/helpers';
import tArea from '@turf/area';
import tBbox from '@turf/bbox';
import tBboxPolygon from '@turf/bbox-polygon';
import SizeAwareElement from '../../common/size-aware-element';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import EditControl from './edit-control';
import { ExploreContext, viewModes } from '../../../context/explore';
import { round } from '../../../utils/format';
import GeoCoder from '../../common/map/geocoder';
import { themeVal, multiply } from '@devseed-ui/theme-provider';

const center = [38.942, -95.449];
const zoom = 4;

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
 * Helper function to extract an AOI from a layer created/edited with Leaflet.draw
 *
 * @param {Object} layer A layer object from Leaflet.draw
 */
function getAoiFromLayer(layer) {
  // Get drawn vector as LineString GeoJSON
  const vertices = layer._latlngs[0].map(({ lat, lng }) => {
    return [lng, lat];
  });
  const lineString = tLineString(vertices);

  // Calculate BBox and area in square kilometers
  const bbox = tBbox(lineString);
  const poly = tBboxPolygon(bbox);
  const area = convertArea(tArea(poly), 'meters', 'kilometers');

  return {
    area: round(area, 0),
    bbox,
  };
}

function Map() {
  const [map, setMap] = useState(null);
  const { previousViewMode, viewMode, setViewMode, setAoi } = useContext(
    ExploreContext
  );
  const [drawRef, setDrawRef] = useState(null);

  /**
   * Handle changes in view mode
   */
  useEffect(() => {
    if (!drawRef) return;

    if (viewMode === viewModes.CREATE_AOI_MODE) {
      drawRef._toolbars.draw._modes.rectangle.handler.enable();
    } else if (viewMode === viewModes.EDIT_AOI_MODE) {
      drawRef._toolbars.edit._modes.edit.handler.enable();
    } else if (previousViewMode === viewModes.EDIT_AOI_MODE) {
      drawRef._toolbars.edit._modes.edit.handler.save();
      drawRef._toolbars.edit._modes.edit.handler.disable();
    }
  }, [drawRef, previousViewMode, viewMode]);

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%' }}
        whenCreated={(m) => {
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
          <EditControl
            onMounted={setDrawRef}
            onCreated={(e) => {
              // Disable draw mode
              setViewMode(viewModes.BROWSE_MODE);

              // Add AOI to context
              setAoi(getAoiFromLayer(e.layer));
            }}
            onEdited={(e) => {
              const layerId = Object.keys(e.layers._layers)[0];

              // Bypass if no layer was touched
              if (typeof layerId === 'undefined') return;

              // Get first layer edited
              const layer = e.layers._layers[layerId];

              // Add AOI to context
              setAoi(getAoiFromLayer(layer));
            }}
            draw={{
              polyline: false,
              polygon: false,
              rectangle: {
                shapeOptions: {
                  stroke: true,
                  color: '#3388ff',
                  weight: 4,
                  opacity: 0.5,
                  fill: false,
                  fillColor: null, //same as color by default
                  fillOpacity: 0.2,
                  showArea: false,
                  clickable: false,
                },
              },
              circle: false,
              circlemarker: false,
              marker: false,
            }}
            edit={{
              edit: true,
              remove: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    ),
    [] // eslint-disable-line react-hooks/exhaustive-deps
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
