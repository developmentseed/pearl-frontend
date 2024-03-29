import React from 'react';
import styled, { css } from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import ShadowScrollbar from '../../../../common/shadow-scrollbar';
import {
  HeadOption as BaseHeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../styles/panel';
import selectors from '../../../../../fsm/project/selectors';
import { ProjectMachineContext } from '../../../../../fsm/project';
import { Subheading } from '../../../../../styles/type/heading';
import { SESSION_MODES } from '../../../../../fsm/project/constants';

export const Option = styled.div`
  display: grid;
  cursor: pointer;
  background: ${themeVal('color.baseDark')};
  padding: ${glsp(0.25)} 0;

  h1 {
    margin: 0;
    padding-left: ${glsp(1.5)};
  }

  ${({ hasSubtitle }) =>
    hasSubtitle &&
    css`
      .subtitle {
        margin: 0;
      }
    `}
  ${({ selected }) =>
    selected &&
    css`
      border-left: ${glsp(0.25)} solid ${themeVal('color.primary')};
      h1 {
        color: ${themeVal('color.primary')};
        padding-left: ${glsp(1.25)};
      }
      background: ${themeVal('color.primaryAlphaA')};
    `}

    ${({ selected }) =>
    !selected &&
    css`
      &:hover {
        background: ${themeVal('color.baseAlphaC')};
      }
    `}
`;
export const HeadOption = styled(BaseHeadOption)`
  grid-template-columns: auto;
  grid-gap: 0;
  ${HeadOptionToolbar} {
    grid-row: auto;
    grid-column: auto;
  }
`;

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

function CheckpointSelector() {
  const actorRef = ProjectMachineContext.useActorRef();
  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const checkpointList = ProjectMachineContext.useSelector(
    selectors.checkpointList
  );
  const currentCheckpoint = ProjectMachineContext.useSelector(
    selectors.currentCheckpoint
  );
  const currentModel = ProjectMachineContext.useSelector(
    selectors.currentModel
  );

  function getCheckpointLabel(c) {
    return c.parent === null
      ? `${currentModel.name} (Base Model)`
      : `${c.name}`;
  }

  let selectedOptionLabel;

  if (sessionMode === SESSION_MODES.LOADING) {
    selectedOptionLabel = 'Loading...';
  } else if (
    !checkpointList ||
    checkpointList?.length === 0 ||
    !currentCheckpoint
  ) {
    selectedOptionLabel = 'Run model to create first checkpoint';
  } else {
    selectedOptionLabel = getCheckpointLabel(currentCheckpoint);
  }

  const selectableCheckpoints = checkpointList?.filter(
    (c) =>
      (c.parent === null || c.bookmarked) &&
      currentCheckpoint &&
      currentCheckpoint.id !== c.id
  );

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
          <CheckpointOption selected data-cy='selected-checkpoint-header'>
            <Heading size='xsmall'>{selectedOptionLabel}</Heading>
          </CheckpointOption>
          {selectableCheckpoints?.map((c) => (
            <CheckpointOption
              key={c.id}
              onClick={async () => {
                actorRef.send({
                  type: 'Apply checkpoint',
                  data: { checkpoint: { ...c } },
                });
              }}
            >
              <Heading size='xsmall'>{getCheckpointLabel(c)}</Heading>
            </CheckpointOption>
          ))}
        </ShadowScrollbar>
      </HeadOption>
    </>
  );
}

CheckpointSelector.propTypes = {};

export default CheckpointSelector;
