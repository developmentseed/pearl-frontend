import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MapContainer, TileLayer } from 'react-leaflet';

import { themeVal, rgba } from '@devseed-ui/theme-provider';
import { MOSAIC_LAYER_OPACITY } from '../../../../../../../fsm/project/constants';

const MapPreviewWrapper = styled.div`
  width: 100%;
`;

const MapPreviewPlaceholder = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  border: ${themeVal('layout.border')} solid
    ${rgba(themeVal('color.base'), 0.16)};
  border-radius: ${themeVal('shape.rounded')};
  justify-content: center;
`;

export const MosaicMapPreview = ({
  mosaicTileUrl,
  initialMapCenter,
  initialMapZoom,
}) => {
  return (
    <MapPreviewWrapper>
      {mosaicTileUrl && initialMapZoom && initialMapCenter ? (
        <MapContainer
          center={initialMapCenter}
          zoom={initialMapZoom}
          style={{ height: '100%' }}
        >
          <TileLayer
            key={mosaicTileUrl}
            url={mosaicTileUrl}
            opacity={MOSAIC_LAYER_OPACITY}
            attribution='&copy; Copernicus Sentinel'
          />
        </MapContainer>
      ) : (
        <MapPreviewPlaceholder>
          <span>Set date to display map preview</span>
        </MapPreviewPlaceholder>
      )}
    </MapPreviewWrapper>
  );
};

MosaicMapPreview.propTypes = {
  mosaicTileUrl: PropTypes.string,
  initialMapZoom: PropTypes.number,
  initialMapCenter: PropTypes.array,
};
