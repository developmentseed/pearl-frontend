import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { glsp } from '@devseed-ui/theme-provider';

import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../styles/panel';
import { EditButton } from '../../../../../styles/button';
import {
  Subheading,
  SubheadingStrong,
} from '../../../../../styles/type/heading';
import { PanelBlockHeader as BasePanelBlockHeader } from '../../../../common/panel-block';
import { useModel } from '../../../../../context/model';
import { useAuth } from '../../../../../context/auth';
import { useCheckpoint } from '../../../../../context/checkpoint';
import AoiSelection from './aoi-selection.js';
import CheckpointSelection from './checkpoint-selection';
import { MosaicSelector } from './mosaic-selector';

const PanelBlockHeader = styled(BasePanelBlockHeader)`
  display: grid;
  grid-gap: ${glsp(0.75)};
  padding: 0;
  margin: unset;
  background: none;
`;

function Header(props) {
  const { checkpointHasSamples, setShowSelectModelModal } = props;

  const { checkpointList } = useCheckpoint();

  const { models, selectedModel } = useModel();
  const { isAuthenticated } = useAuth();

  const modelNotChangeable =
    !isAuthenticated ||
    !models.isReady ||
    models.hasError ||
    checkpointList?.length;

  const renderModelLabel = () => {
    if (!isAuthenticated) {
      return 'Login to select model';
    }

    if (!models.isReady) {
      return 'Loading...';
    }

    if (models.status === 'success' && models.data && models.data.length > 0) {
      return 'Select Model';
    }

    return 'No models available';
  };

  return (
    <PanelBlockHeader id='header'>
      <AoiSelection />
      <MosaicSelector />
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
          {(selectedModel && selectedModel.name) || renderModelLabel()}
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
      <CheckpointSelection checkpointHasSamples={checkpointHasSamples} />
    </PanelBlockHeader>
  );
}

Header.propTypes = {
  checkpointHasSamples: T.bool,
  setShowSelectModelModal: T.func,
};

export default Header;
