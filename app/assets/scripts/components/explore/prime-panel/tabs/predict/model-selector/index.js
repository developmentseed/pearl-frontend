import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../../../../context/auth';
import { useCheckpoint } from '../../../../../../context/checkpoint';
import { useModel } from '../../../../../../context/model';
import { useMosaics } from '../../../../../../context/mosaics';
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

export function ModelSelector() {
  const { isAuthenticated } = useAuth();
  const { models, selectedModel, setSelectedModel } = useModel();
  const { selectedMosaic } = useMosaics();
  const { checkpointList } = useCheckpoint();

  const [showSelectModelModal, setShowSelectModelModal] = useState(false);

  // Check selector state depending on other state variables
  const selectorState = useMemo(() => {
    if (!isAuthenticated) {
      // Needs auth
      return { enabled: false, label: 'Login to select model' };
    } else if (!models.isReady) {
      // Model list is loading
      return { enabled: false, label: 'Loading...' };
    } else if (!selectedMosaic) {
      return { enabled: false, label: 'Please select an imagery source' };
    } else if (
      models.status === 'success' &&
      models.data &&
      models.data.length > 0 &&
      !selectedModel
    ) {
      // Model list is ready and a model can be selected
      return { enabled: true, label: 'Select Model' };
    } else if (selectedModel) {
      // Display selected model name, do not enable selector if there model ran
      // before (has checkpoints)
      const hasCheckpoints = checkpointList?.length > 0;
      return { enabled: !hasCheckpoints, label: selectedModel.name };
    } else {
      // No models available/applicable
      return { enabled: false, label: 'No models available' };
    }
  }, [isAuthenticated, models, selectedModel, selectedMosaic]);

  // Available models depend on the selected imagery
  const availableModels = useMemo(() => {
    if (models.isReady && models.data?.length > 0 && selectedMosaic) {
      return models?.data.filter(
        (m) => m.meta?.imagery_id === selectedMosaic.id
      );
    } else {
      return [];
    }
  }, [models, selectedMosaic]);

  return (
    <>
      <ModelSelectorModal
        setSelectedModel={setSelectedModel}
        showSelectModelModal={showSelectModelModal}
        setShowSelectModelModal={setShowSelectModelModal}
        availableModels={availableModels}
      />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Base Model</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          data-cy='select-model-label'
          onClick={() => selectorState.enabled && setShowSelectModelModal(true)}
          title={selectorState.enabled ? 'Select Model' : selectorState.label}
          disabled={!selectorState.enabled}
        >
          {selectorState.label}
        </SubheadingStrong>
        {selectorState.enabled && (
          <HeadOptionToolbar>
            <EditButton
              data-cy='show-select-model-button'
              useIcon='swap-horizontal'
              id='select-model-trigger'
              onClick={() => {
                setShowSelectModelModal(true);
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
