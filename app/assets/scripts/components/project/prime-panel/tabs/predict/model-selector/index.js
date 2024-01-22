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
import selectors from '../../../../../../fsm/project/selectors';
import * as guards from '../../../../../../fsm/project/guards';
import { SESSION_MODES } from '../../../../../../fsm/project/constants';

export function ModelSelector() {
  const [showModal, setShowModal] = useState(false);
  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const currentAoi = ProjectMachineContext.useSelector(selectors.currentAoi);
  const currentModel = ProjectMachineContext.useSelector(
    selectors.currentModel
  );
  const modelsList = ProjectMachineContext.useSelector(selectors.modelsList);
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const isProjectNew = ProjectMachineContext.useSelector((s) =>
    guards.isProjectNew(s.context)
  );

  const selectableModels = modelsList.filter(
    (model) => model.imagery_source_id === currentImagerySource?.id
  );

  let label;
  let disabled = true;
  if (sessionMode === SESSION_MODES.LOADING) {
    label = 'Loading...';
    disabled = true;
  } else if (isProjectNew) {
    if (!currentAoi) {
      label = 'Define first AOI';
      disabled = true;
    } else if (!currentImagerySource) {
      label = 'Define Imagery Source';
      disabled = true;
    } else if (!currentModel) {
      if (selectableModels.length > 0) {
        label = 'Select Model';
        disabled = false;
      } else {
        label = 'No models available for this imagery source';
        disabled = true;
      }
    } else {
      label = currentModel.name;
      disabled = false;
    }
  } else {
    label = currentModel?.name;
    disabled = true;
  }

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
        {!disabled && (
          <HeadOptionToolbar>
            <EditButton
              data-cy='show-select-model-button'
              useIcon='swap-horizontal'
              id='select-model-trigger'
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
