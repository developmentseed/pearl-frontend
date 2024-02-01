import { useMap } from 'react-leaflet';
import { memo, useEffect } from 'react';
import T from 'prop-types';
import L from 'leaflet';
import React from 'react';
import 'leaflet-side-by-side';

function SideBySideTileLayer({
  leftTile,
  rightTile,
  minZoom,
  maxZoom,
  zIndex,
  opacity,
}) {
  const mapInst = useMap();
  function sideBySideControl() {
    const left = new L.TileLayer(leftTile.url, {
      attribution: leftTile.attr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
      opacity: opacity,
    }).addTo(mapInst);

    const right = new L.TileLayer(rightTile.url, {
      attribution: rightTile.attr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
      opacity: opacity,
    }).addTo(mapInst);

    const ctrl = L.control.sideBySide(left, right);
    return ctrl;
  }

  useEffect(() => {
    if (mapInst === null) {
      return;
    }
    const ctrl = sideBySideControl();
    ctrl.addTo(mapInst);
    L.DomEvent.disableClickPropagation(ctrl);
    return () => {
      ctrl.remove();
    };
  }, []);

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
