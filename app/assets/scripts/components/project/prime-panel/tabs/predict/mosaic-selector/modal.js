import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import CardList, { Card } from '../../../../../common/card-list';
import { ProjectMachineContext } from '../../../../../../fsm/project';
import selectors from '../../../../../../fsm/project/selectors';
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

export function MosaicSelectorModal({ showModal, setShowModal }) {
  const actorRef = ProjectMachineContext.useActorRef();
  const mosaicsList = ProjectMachineContext.useSelector(selectors.mosaicsList);
  const currentMosaic = ProjectMachineContext.useSelector(
    selectors.currentMosaic
  );
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );

  const selectableMosaics = mosaicsList.filter(
    (mosaic) => mosaic.imagery_source_id === currentImagerySource?.id
  );

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
            {' '}
            <Heading>Select an base mosaic</Heading>
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
            data={selectableMosaics}
            renderCard={(mosaic) => {
              const { name, mosaic_ts_end, mosaic_ts_start } = mosaic;

              return (
                <Card
                  data-cy={`select-mosaic-${mosaic.id}-card`}
                  key={mosaic.id}
                  title={mosaic.name}
                  details={{
                    name,
                    'Mosaic Start Date': mosaic_ts_start
                      ? formatDateTime(mosaic_ts_start)
                      : 'N/A',
                    'Mosaic End Date': mosaic_ts_end
                      ? formatDateTime(mosaic_ts_end)
                      : 'N/A',
                  }}
                  borderlessMedia
                  selected={currentMosaic && currentMosaic.id === mosaic.id}
                  onClick={() => {
                    actorRef.send({
                      type: 'Mosaic is selected',
                      data: { mosaic },
                    });
                    setShowModal(false);
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
  showModal: T.bool,
  setShowModal: T.func.isRequired,
};
