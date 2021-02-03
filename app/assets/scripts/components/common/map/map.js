import React, { useState, useEffect } from 'react';
import leaflet from 'leaflet';
import styled from 'styled-components';
import SizeAwareElement from '../size-aware-element';
import T from 'prop-types';

const MapContainer = styled.div`
  height: 100%;
  z-index: 1;
`;

function MapComponent(props) {
  const { children, center, zoom} = props;
  const [map, setMap] = useState();
  useEffect(() => {
    let m = leaflet
      .map('map', { zoomControl: false })
      .setView(center || [0,0], zoom || 5);
    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(m);
    setMap(m);
  }, []);

  return (
    <SizeAwareElement
      element={MapContainer}
      id='map'
      data-cy='leaflet-map'
      onChange={() => {
        if (map) {
          map.invalidateSize();
        }
      }}
    >
      {map &&
        children &&
        React.Children.map(children, (child) =>
          React.cloneElement(child, {
            map,
          })
        )}
    </SizeAwareElement>
  );
}

MapComponent.propTypes = { 
  children: T.node,
  center: T.array,
  zoom: T.number
};

export default MapComponent;
