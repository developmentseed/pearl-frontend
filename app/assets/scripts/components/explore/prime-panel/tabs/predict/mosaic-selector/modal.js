import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import CardList, { Card } from '../../../../../common/card-list';
import { useImagerySource } from '../../../../../../context/imagery-sources';
import { formatDateTime } from '../../../../../../utils/format';

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
  availableMosaics,
}) {
  const { selectedMosaic, setSelectedMosaic } = useImagerySource();

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
            <Heading>Select an base mosaic</Heading>
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
            renderCard={(mosaic) => {
              const {
                id,
                name,
                created,
                updated,
                mosaic_ts_end,
                mosaic_ts_start,
              } = mosaic;

              return (
                <Card
                  data-cy={`select-mosaic-${mosaic.id}-card`}
                  key={mosaic.id}
                  title={mosaic.name}
                  details={{
                    id,
                    name,
                    created: formatDateTime(created),
                    updated: formatDateTime(updated),
                    mosaic_ts_end: formatDateTime(mosaic_ts_end),
                    mosaic_ts_start: formatDateTime(mosaic_ts_start),
                  }}
                  borderlessMedia
                  selected={selectedMosaic && selectedMosaic.id === mosaic.id}
                  onClick={() => {
                    setSelectedMosaic(mosaic);
                    setShowSelectMosaicModal(false);
                  }}
                />
              );
            }}
          />
        </ModalContent>
      }
    />
  );
}

MosaicSelectorModal.propTypes = {
  showSelectMosaicModal: T.bool,
  setShowSelectMosaicModal: T.func.isRequired,
  availableMosaics: T.array,
};
