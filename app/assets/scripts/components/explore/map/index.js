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

const center = [38.942, -95.449];
const zoom = 4;

const Container = styled.div`
  height: 100%;
  z-index: 1;

  .leaflet-draw-toolbar,
  .leaflet-draw-actions {
    visibility: hidden;
  }
`;

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
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <FeatureGroup>
          <EditControl
            onMounted={setDrawRef}
            onCreated={(e) => {
              // Disable draw mode
              setViewMode(viewModes.BROWSE_MODE);

              // Get drawn vector as LineString GeoJSON
              const vertices = e.layer._latlngs[0].map(({ lat, lng }) => {
                return [lng, lat];
              });
              const lineString = tLineString(vertices);

              // Calculate BBox and area in square kilometers
              const bbox = tBbox(lineString);
              const poly = tBboxPolygon(bbox);
              const area = convertArea(tArea(poly), 'meters', 'kilometers');

              // Add AOI to context
              setAoi({
                area: round(area, 0),
                bbox,
              });
            }}
            onEdited={(e) => {
              const layerId = Object.keys(e.layers._layers)[0];
              const layer = e.layers._layers[layerId];
              // Get drawn vector as LineString GeoJSON
              const vertices = layer._latlngs[0].map(({ lat, lng }) => {
                return [lng, lat];
              });
              const lineString = tLineString(vertices);

              // Calculate BBox and area in square kilometers
              const bbox = tBbox(lineString);
              const poly = tBboxPolygon(bbox);
              const area = convertArea(tArea(poly), 'meters', 'kilometers');

              // Add AOI to context
              setAoi({
                area: round(area, 0),
                bbox,
              });
            }}
            draw={{
              polyline: false,
              polygon: false,
              rectangle: true,
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
