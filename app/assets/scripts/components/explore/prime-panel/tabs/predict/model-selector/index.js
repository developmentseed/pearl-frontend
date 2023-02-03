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

  // Check if model cannot be changed
  const modelNotChangeable =
    !isAuthenticated ||
    !selectedMosaic ||
    !models.isReady ||
    models.hasError ||
    checkpointList?.length;

  // Selector label can assume different values depending on state variables, we
  // use useMemo hook to avoid computing it on every render.
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
      return { enabled: !checkpointList?.length, label: selectedModel.name };
    } else {
      // No models available/sapplicable
      return { enabled: false, label: 'No models available' };
    }
  }, [isAuthenticated, models, selectedModel]);

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
          onClick={() => {
            !modelNotChangeable && setShowSelectModelModal(true);
          }}
          title={
            !checkpointList?.length
              ? 'Select Model'
              : 'Models can not be changed after running inference'
          }
          disabled={modelNotChangeable}
        >
          {selectorState.label}
        </SubheadingStrong>
        {!modelNotChangeable && (
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
