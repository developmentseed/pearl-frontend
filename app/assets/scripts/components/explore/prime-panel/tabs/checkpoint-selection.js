import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { themeVal } from '@devseed-ui/theme-provider';

import { HeadOptionHeadline } from '../../../../styles/panel';
import ShadowScrollbar from '../../../common/shadow-scrollbar';
import { Option, HeadOption } from './selection-styles';
import { Subheading } from '../../../../styles/type/heading';
import { useCheckpoint } from '../../../../context/checkpoint';
import { useInstance } from '../../../../context/instance';

import { useModel } from '../../../../context/model';
import { useProject } from '../../../../context/project';
import { useMapState } from '../../../../context/explore';

const CheckpointOption = styled(Option)`
  ${({ disabled }) =>
    disabled &&
    css`
      &:hover {
        background: ${themeVal('color.baseDark')};
        cursor: default;
      }
    `}
`;

function CheckpointSelection({ checkpointHasSamples }) {
  const { currentCheckpoint, checkpointList } = useCheckpoint();
  const { selectedModel } = useModel();
  const { applyCheckpoint } = useInstance();
  const { currentProject } = useProject();
  const { mapState, mapModes } = useMapState();

  const disabled =
    checkpointHasSamples ||
    !checkpointList ||
    mapState.mode === mapModes.EDIT_AOI_MODE;

  const renderSelectedCheckpoint = () => {
    let name;
    if (currentCheckpoint && currentCheckpoint.id) {
      let realname = `${currentCheckpoint.name} (${currentCheckpoint.id})`;
      if (currentCheckpoint.bookmarked) {
        name = realname;
      } else {
        name = currentCheckpoint.parent
          ? 'Current checkpoint (Unsaved)'
          : `${selectedModel.name} (Base Model)`;
      }
    } else if (checkpointList?.length) {
      name = `${checkpointList.length} checkpoint${
        checkpointList.length > 1 ? 's' : ''
      } available`;
    } else {
      name = 'Run model to create first checkpoint';
    }
    return (
      <CheckpointOption selected data-cy='selected-checkpoint-header'>
        <Heading size='xsmall'>{name}</Heading>
      </CheckpointOption>
    );
  };

  return (
    <>
      <HeadOption hasSubtitle>
        <HeadOptionHeadline usePadding>
          <Subheading>Checkpoints</Subheading>
        </HeadOptionHeadline>
        <ShadowScrollbar
          style={{
            minHeight: '6rem',
            maxHeight: '10rem',
            backgroundColor: '#121826',
            padding: '0.25rem 0',
            margin: '0.75rem 0',
            boxShadow: 'inset 0 -1px 0 0 rgba(240, 244, 255, 0.16)',
          }}
        >
          {renderSelectedCheckpoint()}
          {checkpointList?.length &&
            checkpointList
              .filter((ckpt) => ckpt.id != currentCheckpoint?.id)
              .map((ckpt) => (
                <CheckpointOption
                  key={ckpt.id}
                  disabled={disabled}
                  onClick={async () => {
                    if (disabled) {
                      return;
                    }
                    await applyCheckpoint(currentProject.id, ckpt.id);
                  }}
                >
                  <Heading size='xsmall'>
                    {ckpt.parent
                      ? `${ckpt.name} (${ckpt.id})`
                      : `${selectedModel.name} (Base Model)`}
                  </Heading>
                </CheckpointOption>
              ))}
        </ShadowScrollbar>
      </HeadOption>
    </>
  );
}

CheckpointSelection.propTypes = {
  checkpointHasSamples: T.bool,
};

export default CheckpointSelection;
