import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import SizeAwareElement from '../../common/size-aware-element';
import { ImageOverlay, MapContainer } from 'react-leaflet';

import {
  MAX_BASE_MAP_ZOOM_LEVEL,
  BaseMapLayer,
} from '../../common/map/base-map-layer';

import { themeVal, multiply } from '@devseed-ui/theme-provider';
import { ProjectMachineContext } from '../../../context/project-xstate';

const center = [19.22819, -99.995841];
const zoom = 12;

const Container = styled.div`
  height: 100%;
  z-index: 1;
  user-select: none;

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

const selectors = {
  isLoadingMap: (state) => state.matches('Creating map'),
  mapEventHandlers: (state) => state.context.mapEventHandlers,
  currentPrediction: (state) => state.context.currentPrediction,
};

function Map() {
  const [mapRef, setMapRef] = useState();
  const actorRef = ProjectMachineContext.useActorRef();
  const isLoadingMap = ProjectMachineContext.useSelector(
    selectors.isLoadingMap
  );
  const mapEventHandlers = ProjectMachineContext.useSelector(
    selectors.mapEventHandlers
  );
  const currentPrediction = ProjectMachineContext.useSelector(
    selectors.currentPrediction
  );

  const handleMouseDown = useCallback(
    (e) => {
      actorRef.send({
        type: 'Map mousedown',
        data: { latLng: getEventLatLng(e) },
      });
    },
    [actorRef]
  );

  const handleMouseUp = useCallback(
    (e) => {
      actorRef.send({
        type: 'Map mouseup',
        data: { latLng: getEventLatLng(e) },
      });
    },
    [actorRef]
  );

  const handleMouseMove = useCallback(
    (e) => {
      actorRef.send({
        type: 'Map mousemove',
        data: { latLng: getEventLatLng(e) },
      });
    },
    [actorRef]
  );

  useEffect(() => {
    if (isLoadingMap && mapRef) {
      actorRef.send({
        type: 'Map is created',
        data: {
          mapRef,
        },
      });
    }
  }, [mapRef, isLoadingMap]);

  // Enable/disable map drag
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.dragging) {
      mapRef.dragging.enable();
    } else {
      mapRef.dragging.disable();
    }
  }, [mapRef, mapEventHandlers.dragging]);

  // Enable/disable map mousedown
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.mousedown) {
      mapRef.on('mousedown', handleMouseDown);
    } else {
      mapRef.off('mousedown', handleMouseDown);
    }
  }, [mapRef, mapEventHandlers.mousedown]);

  // Enable/disable map mouseup
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.mouseup) {
      mapRef.on('mouseup', handleMouseUp);
    } else {
      mapRef.off('mouseup', handleMouseUp);
    }
  }, [mapRef, mapEventHandlers.mouseup]);

  // Enable/disable map mousemove
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.mousemove) {
      mapRef.on('mousemove', handleMouseMove);
    } else {
      mapRef.off('mousemove', handleMouseMove);
    }
  }, [mapRef, mapEventHandlers.mousemove]);

  return (
    <SizeAwareElement
      element={Container}
      id='map'
      data-cy='leaflet-map'
      onChange={() => {
        if (mapRef) {
          mapRef.invalidateSize();
        }
      }}
    >
      <MapContainer
        tap={false}
        center={center}
        zoom={zoom}
        maxZoom={MAX_BASE_MAP_ZOOM_LEVEL}
        boxZoom={false}
        style={{ height: '100%' }}
        whenCreated={(m) => {
          // Add map to state
          setMapRef(m);

          if (process.env.NODE_ENV !== 'production') {
            // makes map accessible in console for debugging
            window.map = m;
            if (window.Cypress) {
              window.Cypress.map = m;
            }
          }
        }}
      >
        <BaseMapLayer />
        {currentPrediction &&
          currentPrediction.predictions &&
          currentPrediction.predictions.map((p) => (
            <ImageOverlay key={p.key} url={p.image} bounds={p.bounds} />
          ))}
      </MapContainer>
    </SizeAwareElement>
  );
}

export default Map;
