import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MapContainer, TileLayer } from 'react-leaflet';

import { glsp, themeVal, rgba } from '@devseed-ui/theme-provider';
import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';
import toasts from '../../../../../../common/toasts';
import { getMosaicTileUrl } from '../../../../../../../utils/mosaics';
import { MOSAIC_LAYER_OPACITY } from '../../../../../../../fsm/project/constants';
import { usePlanetaryComputerCollection } from '../../../../../../../utils/use-pc-collection';
import { CreateMosaicForm } from './form';

const SectionWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: ${glsp()};
  height: 100%;
`;

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

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const MosaicPreviewMap = ({
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

MosaicPreviewMap.propTypes = {
  mosaicTileUrl: PropTypes.string,
  initialMapZoom: PropTypes.number,
  initialMapCenter: PropTypes.array,
};

export const CreateMosaicSection = ({
  onMosaicCreated,
  className,
  initialMapZoom,
  initialMapCenter,
}) => {
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );

  const {
    data: collection,
    isLoading,
    hasError,
  } = usePlanetaryComputerCollection(currentImagerySource?.name);

  const [newMosaic, setNewMosaic] = useState(null);

  const actorRef = ProjectMachineContext.useActorRef();
  const apiClient = ProjectMachineContext.useSelector(
    ({ context }) => context.apiClient
  );

  const handleMosaicCreation = async () => {
    if (!newMosaic) {
      return;
    }

    try {
      const mosaic = await apiClient.post('mosaic', newMosaic);
      const { mosaics: mosaicsList } = await apiClient.get('mosaic');
      onMosaicCreated();
      actorRef.send({
        type: 'Mosaic was selected',
        data: { mosaic, mosaicsList },
      });
    } catch (error) {
      toasts.error('Error creating mosaic');
    }
  };

  return isLoading ? (
    <LoadingWrapper>
      <span>Loading...</span>
    </LoadingWrapper>
  ) : hasError ? (
    <LoadingWrapper>
      <span>Error loading collection</span>
    </LoadingWrapper>
  ) : (
    <SectionWrapper className={className}>
      <CreateMosaicForm
        collection={collection}
        onMosaicCreated={onMosaicCreated}
        setNewMosaic={setNewMosaic}
        handleMosaicCreation={handleMosaicCreation}
      />
      <MosaicPreviewMap
        initialMapZoom={initialMapZoom}
        initialMapCenter={initialMapCenter}
        mosaicTileUrl={newMosaic && getMosaicTileUrl(newMosaic)}
      />
    </SectionWrapper>
  );
};

CreateMosaicSection.propTypes = {
  onMosaicCreated: PropTypes.func.isRequired,
  className: PropTypes.string,
  initialMapZoom: PropTypes.number,
  initialMapCenter: PropTypes.array,
};
