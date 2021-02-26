import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { lineString as tLineString, convertArea } from '@turf/helpers';
import tArea from '@turf/area';
import tBbox from '@turf/bbox';
import tBboxPolygon from '@turf/bbox-polygon';
import SizeAwareElement from '../../common/size-aware-element';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { ExploreContext, viewModes } from '../../../context/explore';
import { round } from '../../../utils/format';
import GeoCoder from '../../common/map/geocoder';
import { themeVal, multiply } from '@devseed-ui/theme-provider';
import FreeDraw, { ALL } from 'leaflet-freedraw';
import L from 'leaflet';
import AoiControl from './aoi-control';

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

function getEventLatLng(event) {
  const {
    latlng: { lng, lat },
  } = event;
  return [lat, lng];
}

function enterCreateAoiMode(map, onCreateEnd) {
  let start;
  let end;
  let aoiRef;

  function onMouseDown(event) {
    map.dragging.disable();
    map.off('mousedown', onMouseDown);
    start = getEventLatLng(event);

    // Update rectangle on mouse move
    function onMouseMove(event) {
      end = getEventLatLng(event);

      if (!aoiRef) {
        aoiRef = L.rectangle([start, end]).addTo(map);
      } else {
        aoiRef.setBounds([start, end]);
      }
    }

    // Listen to draw end
    function onMouseUp() {
      map.dragging.enable();
      map.off('mousemove', onMouseMove);
      map.off('mouseup', onMouseUp);

      // Calculate BBox and area in square kilometers
      const lineString = tLineString([start, end]);
      const bbox = tBbox(lineString);
      const poly = tBboxPolygon(bbox);
      const area = convertArea(tArea(poly), 'meters', 'kilometers');

      // Return AOI on end
      onCreateEnd({
        area: round(area, 0),
        bbox,
        ref: aoiRef,
      });
    }

    // Add draw events after mouse down
    map.on('mousemove', onMouseMove);
    map.on('mouseup', onMouseUp);
  }

  // Listen to draw start
  map.on('mousedown', onMouseDown);
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
        enterCreateAoiMode(map, (aoi) => {
          setAoi(aoi);
          setViewMode(viewModes.BROWSE_MODE);
        });
        break;
      case viewModes.EDIT_AOI_MODE:
        map.aoiControl.enableEdit(aoi);
        break;
      case viewModes.EDIT_CLASS_MODE:
        map.aoiControl.exitEdit();
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
          // Add AOI Control
          m.aoiControl = new AoiControl(m, (bounds) => {
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
