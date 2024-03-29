import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';

import { ProjectMachineContext } from '../../../../../../fsm/project';
import CardList from '../../../../../common/card-list';
import { ModelCard } from './model-card';
import selectors from '../../../../../../fsm/project/selectors';

const ModalContent = styled.div`
  display: block;
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
`;

export function ModelSelectorModal({ showModal, setShowModal }) {
  const [modelFilter, setModelFilter] = useState('');

  const actorRef = ProjectMachineContext.useActorRef();
  const modelsList = ProjectMachineContext.useSelector(selectors.modelsList);
  const currentModel = ProjectMachineContext.useSelector(
    selectors.currentModel
  );
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const selectableModels = modelsList.filter(
    (model) => model.imagery_source_id === currentImagerySource?.id
  );

  return (
    <Modal
      id='select-model-modal'
      revealed={showModal}
      onOverlayClick={() => setShowModal(false)}
      closeButton={false}
      data={selectableModels}
      content={
        <ModalContent>
          <HeadingWrapper>
            <Heading size='small' as='h4'>
              Available Models
            </Heading>
            <Button
              hideText
              variation='base-plain'
              size='small'
              useIcon='xmark'
              onClick={() => {
                setShowModal(false);
                setModelFilter('');
              }}
            >
              Close modal
            </Button>
          </HeadingWrapper>
          <CardList
            numColumns={2}
            data={modelsList}
            renderCard={(model) => (
              <ModelCard
                key={model.name}
                model={model}
                onClick={() => {
                  actorRef.send({
                    type: 'Model is selected',
                    data: { model },
                  });
                  setShowModal(false);
                }}
                selected={currentModel && currentModel?.id === model.id}
              />
            )}
            filterCard={(card) =>
              card.name.toLowerCase().includes(modelFilter.toLowerCase())
            }
            nonScrolling
          />
        </ModalContent>
      }
      nonScrolling
    />
  );
}

ModelSelectorModal.propTypes = {
  showModal: T.bool,
  setShowModal: T.func.isRequired,
};
