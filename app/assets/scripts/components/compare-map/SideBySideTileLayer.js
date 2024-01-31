import { useMap } from 'react-leaflet';
import { memo, useEffect } from 'react';
import L from 'leaflet';
import React from 'react';
import 'leaflet-side-by-side';

function SideBySideTileLayer(props) {
  const mapInst = useMap();
  function sideBySideControl() {
    const left = new L.TileLayer(props.leftTile.url, {
      attribution: props.leftTile.attr,
      minZoom: 12,
      maxZoom: 20,
      zIndex: 3,
    }).addTo(mapInst);

    const right = new L.TileLayer(props.rightTile.url, {
      attribution: props.rightTile.attr,
      minZoom: 12,
      maxZoom: 20,
      zIndex: 3,
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
    return () => {
      ctrl.remove();
    };
  }, []);

  return <div />;
}

export default memo(SideBySideTileLayer);
