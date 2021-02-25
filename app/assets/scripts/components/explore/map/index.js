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

function enterEditAoiMode(map, aoi, setAoi) {
  const aoiRef = aoi.ref;
  let _resizeMarkers;
  let _oppositeCorner;
  let _moveMarker;

  function _createMoveMarker() {
    var bounds = aoiRef.getBounds(),
      center = bounds.getCenter();

    _moveMarker = _createMarker(center);
  }

  function _createMarker(latlng) {
    var marker = new L.Marker(latlng, {
      draggable: true,
    });

    _bindMarker(marker);

    map.addLayer(marker);

    return marker;
  }

  function _bindMarker(marker) {
    marker
      .on('dragstart', _onMarkerDragStart)
      .on('drag', _onMarkerDrag)
      .on('dragend', _onMarkerDragEnd);
  }

  function _unbindMarker(marker) {
    marker
      .off('dragstart', _onMarkerDragStart)
      .off('drag', _onMarkerDrag)
      .off('dragend', _onMarkerDragEnd);
  }

  function _onMarkerDragStart(e) {
    // L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this, e);

    // Save a reference to the opposite point
    var corners = _getCorners(),
      marker = e.target,
      currentCornerIndex = marker._cornerIndex;

    _oppositeCorner = corners[(currentCornerIndex + 2) % 4];

    _toggleCornerMarkers(0, currentCornerIndex);
  }

  function _onMarkerDragEnd(e) {
    var marker = e.target,
      bounds,
      center;

    // Reset move marker position to the center
    if (marker === this._moveMarker) {
      bounds = this._shape.getBounds();
      center = bounds.getCenter();

      marker.setLatLng(center);
    }

    _toggleCornerMarkers(1);

    _repositionCornerMarkers();

    marker.setOpacity(1);
  }

  function _onMarkerDrag(e) {
    var marker = e.target,
      latlng = marker.getLatLng();

    if (marker === _moveMarker) {
      _move(latlng);
    } else {
      _resize(latlng);
    }

    aoiRef.redraw();
  }

  function _resize(latlng) {
    var bounds;

    // Update the shape based on the current position of this corner and the opposite point
    aoiRef.setBounds(L.latLngBounds(latlng, _oppositeCorner));

    // Reposition the move marker
    bounds = aoiRef.getBounds();
    _moveMarker.setLatLng(bounds.getCenter());
  }

  function _move(newCenter) {
    var latlngs = aoiRef._defaultShape
        ? aoiRef._defaultShape()
        : aoiRef.getLatLngs(),
      bounds = aoiRef.getBounds(),
      center = bounds.getCenter(),
      offset,
      newLatLngs = [];

    // Offset the latlngs to the new center
    for (var i = 0, l = latlngs.length; i < l; i++) {
      offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
      newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
    }

    aoiRef.setLatLngs(newLatLngs);

    _repositionCornerMarkers();
  }

  function _getCorners() {
    const bounds = aoiRef.getBounds();
    const nw = bounds.getNorthWest();
    const ne = bounds.getNorthEast();
    const se = bounds.getSouthEast();
    const sw = bounds.getSouthWest();
    return [nw, ne, se, sw];
  }

  function _createResizeMarkers() {
    const corners = _getCorners();

    _resizeMarkers = [];

    for (var i = 0, l = corners.length; i < l; i++) {
      _resizeMarkers.push(_createMarker(corners[i]));
      // Monkey in the corner index as we will need to know this for dragging
      _resizeMarkers[i]._cornerIndex = i;
    }
  }

  function _toggleCornerMarkers(opacity) {
    for (var i = 0, l = _resizeMarkers.length; i < l; i++) {
      _resizeMarkers[i].setOpacity(opacity);
    }
  }

  function _repositionCornerMarkers() {
    var corners = _getCorners();

    for (var i = 0, l = _resizeMarkers.length; i < l; i++) {
      _resizeMarkers[i].setLatLng(corners[i]);
    }
  }

  _createResizeMarkers();
  _createMoveMarker();
}

function Map() {
  const [map, setMap] = useState(null);
  const { viewMode, previousViewMode, setViewMode, aoi, setAoi } = useContext(
    ExploreContext
  );

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
        enterEditAoiMode(map, aoi, setAoi);
        break;
      case viewModes.EDIT_CLASS_MODE:
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
