import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { themeVal, glsp, truncated } from '@devseed-ui/theme-provider';

import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../styles/panel';
import { EditButton } from '../../../styles/button';
import { Subheading } from '../../../styles/type/heading';
import collecticon from '@devseed-ui/collecticons';
import { PanelBlockHeader as BasePanelBlockHeader } from '../../common/panel-block';
import { useModel } from '../../../context/model';
import { useAuth } from '../../../context/auth';
import { useCheckpoint } from '../../../context/checkpoint';
import AoiSelection from './tabs/aoi-selection.js';
import CheckpointSelection from './tabs/checkpoint-selection';

const SubheadingStrong = styled.h3`
  color: ${themeVal('color.base')};
  font-weight: ${themeVal('type.heading.weight')};
  font-size: 1.125rem;
  line-height: 1.5rem;
  ${truncated}

  ${({ useIcon }) =>
    useIcon &&
    css`
      display: grid;
      grid-template-columns: max-content max-content;
      grid-gap: 1rem;
      &::after {
        ${collecticon(useIcon)}
      }
    `}
  ${({ onClick, disabled }) =>
    onClick &&
    !disabled &&
    css`
      transition: opacity 0.24s ease 0s;
      &:hover {
        cursor: pointer;
        opacity: 0.64;
      }
    `}
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.64;
    `}
`;

const PanelBlockHeader = styled(BasePanelBlockHeader)`
  display: grid;
  grid-gap: ${glsp(0.75)};
  margin: unset;
  padding: unset;
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

      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Selected Model</Subheading>
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
