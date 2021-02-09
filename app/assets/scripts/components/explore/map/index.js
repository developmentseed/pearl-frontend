import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import SizeAwareElement from '../../common/size-aware-element';
import { MapContainer, TileLayer } from 'react-leaflet';

const center = [38.942, -95.449];
const zoom = 4;

const Container = styled.div`
  height: 100%;
  z-index: 1;
`;

function Map() {
  const [map, setMap] = useState(null);

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%' }}
        scrollWheelZoom={false}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>
    ),
    []
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
