import React, { useState, useEffect } from 'react';
import leaflet from 'leaflet';
import styled from 'styled-components';
import SizeAwareElement from '../size-aware-element';
import T from 'prop-types';

const MapContainer = styled.div`
  height: 100%;
  z-index: 1;
`;

/* Componentized Leaflet Map container
 * Map reference is passed as prop to children
 * @param center - [lat, lon] map center
 * @param zoom - [number] map zoom
 */

function MapComponent(props) {
  const { children, center, zoom } = props;
  const [map, setMap] = useState();
  useEffect(() => {
    let m = leaflet.map('map', { zoomControl: false });
    m.on('load', () => {
      setMap(m);
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(m);

      if (process.env.NODE_ENV === 'development') {
        // makes map accessible in console for debugging
        window.map = m;
      }
    });
    return () => {
      map.remove();
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (map) {
      map.setView(center || [0, 0], zoom || 5);
    }
  }, [map, center, zoom]);

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
  zoom: T.number,
};

export default MapComponent;
