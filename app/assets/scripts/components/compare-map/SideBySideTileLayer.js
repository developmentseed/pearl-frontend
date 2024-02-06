import { useMap } from 'react-leaflet';
import { memo, useEffect, useRef } from 'react';
import T from 'prop-types';
import L from 'leaflet';
import React from 'react';
import './leaflet-side-by-side';

function SideBySideTileLayer({
  leftTile,
  rightTile,
  minZoom,
  maxZoom,
  zIndex,
}) {
  const mapRef = useMap();
  const leftMap = useRef(null);
  const rightMap = useRef(null);

  function sideBySideControl() {
    leftMap.current = new L.TileLayer(leftTile.url, {
      attribution: leftTile.attr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
      opacity: leftTile.opacity,
    }).addTo(mapRef);

    rightMap.current = new L.TileLayer(rightTile.url, {
      attribution: rightTile.attr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
      opacity: rightTile.opacity,
    }).addTo(mapRef);

    const ctrl = L.control.sideBySide(leftMap.current, rightMap.current);
    return ctrl;
  }

  useEffect(() => {
    if (mapRef === null) {
      return;
    }
    const ctrl = sideBySideControl();
    ctrl.addTo(mapRef);
    L.DomEvent.disableClickPropagation(mapRef._container);
    return () => {
      ctrl.remove();
    };
  }, []);

  useEffect(() => {
    if (leftMap.current && rightMap.current) {
      leftMap.current.setOpacity(leftTile.opacity);
      rightMap.current.setOpacity(rightTile.opacity);
    }
  }, [leftTile.opacity, rightTile.opacity]);

  return <div />;
}

SideBySideTileLayer.propTypes = {
  leftTile: T.object,
  rightTile: T.object,
  minZoom: T.number,
  maxZoom: T.number,
  zIndex: T.number,
  opacity: T.number,
};

export default memo(SideBySideTileLayer);
