import React, { useState } from 'react';
import { ProjectMachineContext } from '../../../../../../fsm/project';
import { EditButton } from '../../../../../../styles/button';
import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../../styles/panel';
import {
  Subheading,
  SubheadingStrong,
} from '../../../../../../styles/type/heading';
import { ModelSelectorModal } from './modal';

export const modelSelectors = {
  selectorStatus: (state) => state.context.modelSelector,
  currentModel: (state) => state.context.currentModel,
  currentImagerySource: (state) => state.context.currentImagerySource,
  modelsList: (state) => state.context.modelsList,
};

export function ModelSelector() {
  const [showModal, setShowModal] = useState(false);
  const modelSelector = ProjectMachineContext.useSelector(
    modelSelectors.selectorStatus
  );
  const currentModel = ProjectMachineContext.useSelector(
    modelSelectors.currentModel
  );

  const { disabled, hidden } = modelSelector;

  const label = currentModel?.name || modelSelector.placeholderLabel;

  return (
    <>
      <ModelSelectorModal showModal={showModal} setShowModal={setShowModal} />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Base Model</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          data-cy='select-model-label'
          onClick={() => !disabled && setShowModal(true)}
          title={label}
          disabled={!!disabled}
        >
          {label}
        </SubheadingStrong>
        {!hidden && (
          <HeadOptionToolbar>
            <EditButton
              data-cy='show-select-model-button'
              useIcon='swap-horizontal'
              id='select-model-trigger'
              disabled={disabled}
              onClick={() => {
                setShowModal(true);
              }}
              title='Select Model'
            >
              Edit Model Selection
            </EditButton>
          </HeadOptionToolbar>
        )}
      </HeadOption>
    </>
  );
}
