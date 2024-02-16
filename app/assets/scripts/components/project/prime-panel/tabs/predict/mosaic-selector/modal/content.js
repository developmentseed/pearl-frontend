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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${glsp()};
  height: 100%;
  min-height: 35rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 35rem;
`;

export const MosaicContentInner = ({
  onMosaicCreated,
  className,
  initialMapZoom,
  initialMapCenter,
}) => {
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const timeframesList = ProjectMachineContext.useSelector(
    ({ context }) => context.timeframesList
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

    // Create mosaic or retrieve existing one
    let mosaic;
    try {
      mosaic = await apiClient.post('mosaic', newMosaic);
    } catch (error) {
      if (error.message === 'mosaics already exists') {
        try {
          mosaic = await apiClient.get(`mosaic/${newMosaic.id}`);
        } catch (error) {
          toasts.error('Error creating mosaic');
          return;
        }
      }
    }

    // Check if mosaic is already used by a timeframe
    const existingTimeframe = timeframesList.find(
      (timeframe) => timeframe.mosaic === mosaic.id
    );

    if (existingTimeframe) {
      actorRef.send({
        type: 'Apply existing timeframe',
        data: { timeframe: existingTimeframe },
      });
      onMosaicCreated();
      return;
    }

    try {
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
        acquisitionStart={collection?.acquisitionStart}
        acquisitionEnd={collection?.acquisitionEnd}
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

MosaicContentInner.propTypes = {
  onMosaicCreated: PropTypes.func.isRequired,
  className: PropTypes.string,
  initialMapZoom: PropTypes.number,
  initialMapCenter: PropTypes.array,
};
