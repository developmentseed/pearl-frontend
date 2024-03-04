import React, { useState } from 'react';

import styled, { css } from 'styled-components';

import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { ActionButton } from '../../../../../../styles/button';
import ShadowScrollbar from '../../../../../common/shadow-scrollbar';
import {
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../../styles/panel';
import { Subheading } from '../../../../../../styles/type/heading';
import { MosaicSelectorModal } from './modal';

import { ProjectMachineContext } from '../../../../../../fsm/project';
import { SESSION_MODES } from '../../../../../../fsm/project/constants';
import selectors from '../../../../../../fsm/project/selectors';
import * as guards from '../../../../../../fsm/project/guards';

import { formatMosaicDateRange } from '../../../../../../utils/dates';
import { SelectorHeadOption } from '../../../selection-styles';

const Option = styled.div`
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

const MosaicOption = styled(Option)`
  ${({ disabled }) =>
    disabled &&
    css`
      &:hover {
        background: ${themeVal('color.baseDark')};
        cursor: default;
      }
    `}
`;

export function MosaicSelector() {
  const actorRef = ProjectMachineContext.useActorRef();
  const [showModal, setShowModal] = useState(false);

  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const isProjectNew = ProjectMachineContext.useSelector((s) =>
    guards.isProjectNew(s.context)
  );
  const currentAoi = ProjectMachineContext.useSelector(selectors.currentAoi);
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const currentMosaic = ProjectMachineContext.useSelector(
    selectors.currentMosaic
  );
  const currentTimeframe = ProjectMachineContext.useSelector(
    selectors.currentTimeframe
  );
  const currentCheckpoint = ProjectMachineContext.useSelector(
    selectors.currentCheckpoint
  );
  const timeframesList = ProjectMachineContext.useSelector(
    ({ context }) => context.timeframesList
  );
  const mosaicsList = ProjectMachineContext.useSelector(
    ({ context }) => context.mosaicsList
  );

  let label;
  let disabled = true;
  if (sessionMode === SESSION_MODES.LOADING) {
    label = 'Loading...';
  } else if (!currentAoi || !currentAoi.name) {
    label = 'Define first AOI';
  } else if (!currentImagerySource) {
    label = 'Define Imagery Source';
  } else if (currentMosaic) {
    label = formatMosaicDateRange(
      currentMosaic?.mosaic_ts_start,
      currentMosaic?.mosaic_ts_end
    );
    disabled = false;
  } else {
    label = isProjectNew
      ? 'Select Mosaic'
      : 'This checkpoint has no mosaics, please select one.';
    disabled = false;
  }

  const optionsList = timeframesList
    ?.filter((t) => t.checkpoint_id === currentCheckpoint?.id)
    .map((t) => {
      const mosaic = mosaicsList.find((m) => m.id === t.mosaic);
      return {
        id: t.id,
        label: formatMosaicDateRange(
          mosaic.mosaic_ts_start,
          mosaic.mosaic_ts_end
        ),
        timeframe: t,
      };
    });

  return (
    <>
      <MosaicSelectorModal
        showModal={showModal}
        setShowModal={setShowModal}
        isProjectNew={isProjectNew}
        imagerySource={currentImagerySource}
      />

      <SelectorHeadOption hasSubtitle>
        <HeadOptionHeadline usePadding>
          <Subheading>Mosaics</Subheading>
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
          <MosaicOption
            selected
            data-cy='selected-timeframe-header'
            onClick={() => !currentMosaic && setShowModal(true)}
          >
            <Heading size='xsmall'>{label}</Heading>
          </MosaicOption>
          {!!optionsList?.length &&
            optionsList
              .filter((t) => t.id != currentTimeframe?.id)
              .map((t) => (
                <MosaicOption
                  key={t.id}
                  disabled={disabled}
                  onClick={async () => {
                    actorRef.send({
                      type: 'Apply existing timeframe',
                      data: { timeframe: { ...t.timeframe } },
                    });
                  }}
                >
                  <Heading size='xsmall'>{t.label}</Heading>
                </MosaicOption>
              ))}
        </ShadowScrollbar>
        <HeadOptionToolbar>
          <ActionButton
            data-cy='mosaic-selector-label'
            onClick={() => !disabled && setShowModal(true)}
            title={label}
            disabled={disabled}
            useIcon='plus'
          >
            {label}
          </ActionButton>
          {currentMosaic && (
            <ActionButton
              title='Delete Current Mosaic'
              id='delete-current-mosaic'
              useIcon='trash-bin'
              onClick={() => {
                actorRef.send({
                  type: 'Delete timeframe',
                });
              }}
            >
              Delete Current Mosaic
            </ActionButton>
          )}
        </HeadOptionToolbar>
      </SelectorHeadOption>
    </>
  );
}
