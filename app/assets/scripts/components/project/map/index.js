import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import SizeAwareElement from '../../common/size-aware-element';
import { MapContainer } from 'react-leaflet';

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

const selectors = {
  isLoadingMap: (state) => state.matches('Creating map'),
};

function Map() {
  const [mapRef, setMapRef] = useState();
  const actorRef = ProjectMachineContext.useActorRef();
  const isLoadingMap = ProjectMachineContext.useSelector(
    selectors.isLoadingMap
  );

  const displayMap = useMemo(() => {
    return (
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
        }}
      >
        <BaseMapLayer />
      </MapContainer>
    );
  }, [setMapRef]);

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
      {displayMap}
    </SizeAwareElement>
  );
}

export default Map;
