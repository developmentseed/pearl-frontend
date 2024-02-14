import React, { useState, useEffect } from 'react';
import { MapContainer, FeatureGroup } from 'react-leaflet';

import { BOUNDS_PADDING } from '../common/map/constants';
import { MAX_BASE_MAP_ZOOM_LEVEL } from '../common/map/base-map-layer';
import GenericControl from '../common/map/generic-control';
import SideBySideTileLayer from './SideBySideTileLayer';
import { toTitleCase } from '../../utils/format';

const INITIAL_MAP_LAYERS = {
  predictionsLeft: {
    id: 'predictionsLeft',
    name: 'Left Prediction Results',
    opacity: 1,
    visible: true,
    active: true,
  },
  predictionsRight: {
    id: 'predictionsRight',
    name: 'Right Prediction Results',
    opacity: 1,
    visible: true,
    active: true,
  },
};

function SideBySideView(
  tileUrls,
  aoisInfo,
  mosaicUrls,
  mapRef,
  setMapRef,
  bounds
) {
  const [mapLayers] = useState(INITIAL_MAP_LAYERS);
  const [showLayersControl, setShowLayersControl] = useState(false);
  useEffect(() => {
    if (!mapRef) return;

    if (aoiData.bounds && aoiData.bounds.coordinates) {
      const bounds = [
        aoiData.bounds.coordinates[0][0].reverse(),
        aoiData.bounds.coordinates[0][2].reverse(),
      ];
      mapRef.fitBounds(bounds, {
        padding: BOUNDS_PADDING,
        maxZoom: MAX_BASE_MAP_ZOOM_LEVEL,
      });
    }
  }, [mapRef]);
  return (
    <MapContainer
      style={{ height: '100%' }}
      maxZoom={MAX_BASE_MAP_ZOOM_LEVEL}
      whenCreated={(m) => {
        setMapRef(m);
      }}
    >
      {tileUrls.length === 2 &&
        mosaicUrls.length === 2 &&
        aoisInfo.length === 2 && (
          <SideBySideTileLayer
            leftTile={{
              url: tileUrls[0],
              mosaicUrl: mosaicUrls[0],
              attr: toTitleCase(
                `${aoisInfo[0].mosaic.params.collection.replace(
                  /-/g,
                  ' '
                )} | Microsoft Planetary Computer`
              ),
              opacity: mapLayers.predictionsLeft.visible
                ? mapLayers.predictionsLeft.opacity
                : 0,
            }}
            rightTile={{
              url: tileUrls[1],
              mosaicUrl: mosaicUrls[1],
              attr: toTitleCase(
                `${aoisInfo[1].mosaic.params.collection.replace(
                  /-/g,
                  ' '
                )} | Microsoft Planetary Computer`
              ),
              opacity: mapLayers.predictionsRight.visible
                ? mapLayers.predictionsRight.opacity
                : 0,
            }}
            minZoom={10}
            maxZoom={20}
            zIndex={3}
          />
        )}
      <FeatureGroup>
        <GenericControl
          id='layer-control'
          onClick={(e) => {
            e.stopPropagation();
            setShowLayersControl(!showLayersControl);
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}

export default SideBySideView;
