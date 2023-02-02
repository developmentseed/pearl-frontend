import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';

import ModelCard from '../../../model-card';
import SelectModal from '../../../../../common/select-modal';
import AutoFocusFormInput from '../../../../../common/auto-focus-form-input';

const ModalHeader = styled.header`
  padding: ${glsp(2)} ${glsp(2)} 0;
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

const FilterSection = styled.div`
  padding-bottom: ${glsp(1)};
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
    <SelectModal
      id='select-model-modal'
      revealed={showSelectModelModal}
      onOverlayClick={() => setShowSelectModelModal(false)}
      data={availableModels}
      renderHeader={() => (
        <ModalHeader>
          <Headline>
            {' '}
            <Heading>Starter Models</Heading>
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
          </Headline>
          <FilterSection>
            <AutoFocusFormInput
              inputId='modelsFilter'
              value={modelFilter}
              setValue={setModelFilter}
              placeholder='Search models by name'
            />
          </FilterSection>
        </ModalHeader>
      )}
      filterCard={(card) =>
        card.name.toLowerCase().includes(modelFilter.toLowerCase())
      }
      renderCard={(model) => (
        <ModelCard
          key={model.name}
          model={model}
          onClick={() => {
            setShowSelectModelModal(false);
            setSelectedModel(model.id);
          }}
          selected={selectedModel?.id === model.id}
        />
      )}
      nonScrolling
    />
  );
}

const ModelType = T.shape({
  id: T.string.isRequired,
  name: T.string.isRequired,
});

ModelSelectorModal.propTypes = {
  showSelectModelModal: T.bool,
  setShowSelectModelModal: T.func.isRequired,
  availableModels: T.arrayOf(ModelType).isRequired,
  selectedModel: ModelType,
  setSelectedModel: T.func.isRequired,
};
