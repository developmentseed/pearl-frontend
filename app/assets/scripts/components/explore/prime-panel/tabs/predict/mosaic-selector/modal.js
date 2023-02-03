import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import CardList, { Card } from '../../../../../common/card-list';

const ModalHeader = styled.header`
  padding: ${glsp(2)} ${glsp(2)} 0;
`;

const ModalContent = styled.div`
  display: block;
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

const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
`;

export function MosaicSelectorModal({
  showSelectMosaicModal,
  setShowSelectMosaicModal,
  selectedMosaic,
  setSelectedMosaic,
  availableMosaics,
}) {
  return (
    <Modal
      id='select-mosaic-modal'
      className='select'
      size='xlarge'
      revealed={showSelectMosaicModal}
      onOverlayClick={() => setShowSelectMosaicModal(false)}
      closeButton={false}
      renderHeader={() => (
        <ModalHeader>
          <Headline>
            {' '}
            <Heading>Select an imagery source</Heading>
            <Button
              hideText
              variation='base-plain'
              size='small'
              useIcon='xmark'
              onClick={() => {
                setShowSelectMosaicModal(false);
              }}
            >
              Close modal
            </Button>
          </Headline>
        </ModalHeader>
      )}
      content={
        <ModalContent>
          <HeadingWrapper>
            <Heading size='small' as='h4'>
              Available mosaics for the AOI
            </Heading>
          </HeadingWrapper>
          <CardList
            nonScrolling
            numColumns={2}
            data={availableMosaics}
            renderCard={(mosaic) => (
              <Card
                data-cy={`select-model-${mosaic.id}-card`}
                key={mosaic.id}
                title={mosaic.name}
                details={mosaic}
                expanded
                borderlessMedia
                selected={selectedMosaic && selectedMosaic.id === mosaic.id}
                onClick={() => {
                  setSelectedMosaic(mosaic);
                  setShowSelectMosaicModal(false);
                }}
              />
            )}
          />
        </ModalContent>
      }
    />
  );
}

const MosaicType = T.shape({
  id: T.string.isRequired,
  name: T.string.isRequired,
});

MosaicSelectorModal.propTypes = {
  showSelectMosaicModal: T.bool,
  setShowSelectMosaicModal: T.func.isRequired,
  availableMosaics: T.arrayOf(MosaicType).isRequired,
  selectedMosaic: MosaicType,
  setSelectedMosaic: T.func.isRequired,
};
