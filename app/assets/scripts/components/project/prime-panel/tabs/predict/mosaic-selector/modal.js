import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';

import { CreateMosaicSection } from './sections/create-mosaic';
import { ProjectMachineContext } from '../../../../../../fsm/project';
import { usePlanetaryComputerCollection } from '../../../../../../utils/use-pc-collection';

const ModalHeader = styled.header`
  padding: ${glsp(2)} ${glsp(2)} 0;
`;

const ModalContent = styled.div`
  display: flex;
  flex-flow: column;
  height: 60vh;
`;

const Headline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${glsp(1)};

  h1 {
    margin: 0;
  }

  ${Button} {
    height: min-content;
    align-self: center;
  }
`;

export function MosaicSelectorModal({ showModal, setShowModal }) {
  const mapRef = ProjectMachineContext.useSelector(
    ({ context }) => context.mapRef
  );

  // Get the current map zoom and center on modal open
  const [mapZoom, mapCenter] = useMemo(() => {
    if (!showModal || !mapRef) return [null, null];
    const { lng, lat } = mapRef.getCenter();
    return [mapRef.getZoom(), [lat, lng]];
  }, [mapRef, showModal]);

  return (
    <Modal
      id='select-mosaic-modal'
      className='select'
      size='xlarge'
      revealed={showModal}
      onOverlayClick={() => setShowModal(false)}
      closeButton={false}
      renderHeader={() => (
        <ModalHeader>
          <Headline>
            <Heading>Set Mosaic Date Range</Heading>
            <Button
              hideText
              variation='base-plain'
              size='small'
              useIcon='xmark'
              onClick={() => {
                setShowModal(false);
              }}
            >
              Close modal
            </Button>
          </Headline>
        </ModalHeader>
      )}
      content={
        <ModalContent>
          <CreateMosaicSection
            name='Create Mosaic'
            className='create-mosaic'
            tabId='create-mosaic-tab-trigger'
            initialMapZoom={mapZoom}
            initialMapCenter={mapCenter}
            onMosaicCreated={() => {
              setShowModal(false);
            }}
          />
        </ModalContent>
      }
    />
  );
}

MosaicSelectorModal.propTypes = {
  showModal: T.bool,
  setShowModal: T.func.isRequired,
  imagerySource: T.shape({
    name: T.string,
  }),
};
