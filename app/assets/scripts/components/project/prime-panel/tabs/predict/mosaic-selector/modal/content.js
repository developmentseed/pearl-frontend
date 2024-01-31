import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { glsp } from '@devseed-ui/theme-provider';
import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';
import toasts from '../../../../../../common/toasts';
import { getMosaicTileUrl } from '../../../../../../../utils/mosaics';
import { usePlanetaryComputerCollection } from '../../../../../../../utils/use-pc-collection';
import { CreateMosaicForm } from './form';
import { MosaicMapPreview } from './map-preview';

const SectionWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: ${glsp()};
  height: 100%;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

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
        acquisitionStart={collection.acquisitionStart}
        acquisitionEnd={collection.acquisitionEnd}
        onMosaicCreated={onMosaicCreated}
        setNewMosaic={setNewMosaic}
        handleMosaicCreation={handleMosaicCreation}
      />
      <MosaicMapPreview
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
