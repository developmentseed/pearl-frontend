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
  const leftPredictionLayerRef = useRef(null);
  const rightPredictionLayerRef = useRef(null);

  function sideBySideControl() {
    // Create Layer group for the left panel
    leftPredictionLayerRef.current = new L.TileLayer(leftTile.url, {
      attribution: leftTile.attr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
      opacity: leftTile.opacity,
    });

    const leftMosaicLayer = new L.TileLayer(leftTile.mosaicUrl, {
      attribution: leftTile.mosaicAttr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
    });

    const leftLayerGroup = new L.layerGroup([
      leftMosaicLayer,
      leftPredictionLayerRef.current,
    ]).addTo(mapRef);

    //  Create Layer group for the right panel
    rightPredictionLayerRef.current = new L.TileLayer(rightTile.url, {
      attribution: rightTile.attr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
      opacity: rightTile.opacity,
    });

    const rightMosaicLayer = new L.TileLayer(rightTile.mosaicUrl, {
      attribution: rightTile.mosaicAttr,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zIndex: zIndex,
    });

    const rightLayerGroup = new L.layerGroup([
      rightMosaicLayer,
      rightPredictionLayerRef.current,
    ]).addTo(mapRef);

    const ctrl = L.control.sideBySide(leftLayerGroup, rightLayerGroup);
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
    if (leftPredictionLayerRef.current && rightPredictionLayerRef.current) {
      leftPredictionLayerRef.current.setOpacity(leftTile.opacity);
      rightPredictionLayerRef.current.setOpacity(rightTile.opacity);
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
