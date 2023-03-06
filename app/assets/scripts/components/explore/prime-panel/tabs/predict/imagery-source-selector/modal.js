import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import CardList, { Card } from '../../../../../common/card-list';
import { useImagerySource } from '../../../../../../context/imagery-sources';

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

export function ImagerySourceSelectorModal({
  showSelectImagerySourceModal,
  setShowSelectImagerySourceModal,
  availableImagerySources,
}) {
  const {
    selectedImagerySource,
    setSelectedImagerySource,
  } = useImagerySource();

  return (
    <Modal
      id='select-imagery-source-modal'
      className='select'
      size='xlarge'
      revealed={showSelectImagerySourceModal}
      onOverlayClick={() => setShowSelectImagerySourceModal(false)}
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
                setShowSelectImagerySourceModal(false);
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
            data={availableImagerySources}
            renderCard={(imagerySource) => (
              <Card
                data-cy={`select-imagery-${imagerySource.id}-card`}
                key={imagerySource.id}
                title={imagerySource.name}
                details={{
                  name: imagerySource.name,
                  created: imagerySource.created,
                  updated: imagerySource.updated,
                }}
                borderlessMedia
                selected={
                  selectedImagerySource &&
                  selectedImagerySource.id === imagerySource.id
                }
                onClick={() => {
                  setSelectedImagerySource(imagerySource);
                  setShowSelectImagerySourceModal(false);
                }}
              />
            )}
          />
        </ModalContent>
      }
    />
  );
}

ImagerySourceSelectorModal.propTypes = {
  showSelectImagerySourceModal: T.bool,
  setShowSelectImagerySourceModal: T.func.isRequired,
  availableImagerySources: T.array,
};
