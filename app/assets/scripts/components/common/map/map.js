import React, { useState, useEffect } from 'react';
import leaflet from 'leaflet';
import styled from 'styled-components';
import SizeAwareElement from '../size-aware-element';
import T from 'prop-types';

const MapContainer = styled.div`
  height: 100%;
  z-index: 1;

  .leaflet-top.leaflet-left {
    /* Shift control container vertically */
    top: 7.5vh;
    .leaflet-geosearch-button.active form {
      /* CSS quirk to make input box the right height */
      line-height: 2.5;
    }
  }
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
    let m = leaflet
      .map('map', { zoomControl: true })
      .setView(center || [0, 0], zoom || 5);

    m.whenReady(() => {
      setMap(m);
      if (process.env.NODE_ENV === 'development') {
        // makes map accessible in console for debugging
        window.map = m;
      }
    });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (map && center && zoom) {
      map.setView(center, zoom);
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
