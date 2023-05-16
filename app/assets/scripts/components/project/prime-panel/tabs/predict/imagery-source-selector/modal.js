import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import CardList, { Card } from '../../../../../common/card-list';
import { ProjectMachineContext } from '../../../../../../fsm/project';
import { imagerySourceSelectors } from '.';

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

export function ImagerySourceSelectorModal({ showModal, setShowModal }) {
  const actorRef = ProjectMachineContext.useActorRef();
  const imagerySourcesList = ProjectMachineContext.useSelector(
    imagerySourceSelectors.imagerySourcesList
  );
  const currentImagerySource = ProjectMachineContext.useSelector(
    imagerySourceSelectors.currentImagerySource
  );

  return (
    <Modal
      id='select-imagery-source-modal'
      className='select'
      size='xlarge'
      revealed={showModal}
      onOverlayClick={() => setShowModal(false)}
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
          <HeadingWrapper>
            <Heading size='small' as='h4'>
              Available mosaics for the AOI
            </Heading>
          </HeadingWrapper>
          <CardList
            nonScrolling
            numColumns={2}
            data={imagerySourcesList}
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
                  currentImagerySource &&
                  currentImagerySource.id === imagerySource.id
                }
                onClick={() => {
                  actorRef.send({
                    type: 'Imagery source is selected',
                    data: { imagerySource },
                  });
                  setShowModal(false);
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
  showModal: T.bool,
  setShowModal: T.func.isRequired,
};
