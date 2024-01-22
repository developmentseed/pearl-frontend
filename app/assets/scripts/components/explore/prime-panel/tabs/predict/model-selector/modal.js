import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';

import ModelCard from '../../../model-card';
import CardList from '../../../../../common/card-list';

const ModalContent = styled.div`
  display: block;
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
`;

export function ModelSelectorModal({
  showSelectModelModal,
  setShowSelectModelModal,
  selectedModel,
  setSelectedModel,
  availableModels,
}) {
  const [modelFilter, setModelFilter] = useState('');

  return (
    <Modal
      id='select-model-modal'
      revealed={showSelectModelModal}
      onOverlayClick={() => setShowSelectModelModal(false)}
      closeButton={false}
      data={availableModels}
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
                setShowSelectModelModal(false);
                setModelFilter('');
              }}
            >
              Close modal
            </Button>
          </HeadingWrapper>
          <CardList
            numColumns={2}
            data={availableModels}
            renderCard={(model) => (
              <ModelCard
                key={model.name}
                model={model}
                onClick={() => {
                  setShowSelectModelModal(false);
                  setSelectedModel(model);
                }}
                selected={selectedModel?.id === model.id}
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

const ModelType = T.shape({
  id: T.number.isRequired,
  name: T.string.isRequired,
});

ModelSelectorModal.propTypes = {
  showSelectModelModal: T.bool,
  setShowSelectModelModal: T.func.isRequired,
  availableModels: T.arrayOf(ModelType).isRequired,
  selectedModel: ModelType,
  setSelectedModel: T.func.isRequired,
};
