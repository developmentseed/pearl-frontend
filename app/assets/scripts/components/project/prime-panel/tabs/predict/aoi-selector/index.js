import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import get from 'lodash.get';

import { AoiActionButtons } from './action-buttons';
import {
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../../styles/panel';
import { Subheading } from '../../../../../../styles/type/heading';
import ShadowScrollbar from '../../../../../common/shadow-scrollbar';

import { EditButton } from '../../../../../../styles/button';
import { ProjectMachineContext } from '../../../../../../context/project-xstate';
import { SelectorHeadOption, SelectorOption } from '../../../selection-styles';
import { formatThousands } from '../../../../../../utils/format';
import { ConfirmAoiChangeModal } from './modals/confirm-aoi-change';

const AoiOption = styled(SelectorOption)`
  grid-template-columns: auto min-content;
  padding-right: ${glsp(1.5)};

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
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: start;
      cursor: unset;
      grid-gap: 1rem;
    `}



  .aoi-delete-button {
    visibility: hidden;
  }

  &:hover {
    .aoi-delete-button {
      visibility: visible;
    }
  }
`;

const ActiveAoiOption = ({ label, area }) => {
  return (
    <AoiOption hasSubtitle selected data-cy='selected-aoi-header'>
      <Heading size='xsmall'>{label}</Heading>
      {area && (
        <Subheading size='xsmall' className='subtitle'>
          {`${formatThousands(area / 1e6)} km2`}
        </Subheading>
      )}
    </AoiOption>
  );
};

ActiveAoiOption.propTypes = {
  label: T.string,
  area: T.number,
};

const selectors = {
  aoiStatusMessage: (state) => state.context.aoiStatusMessage,
  currentAoi: (state) => state.context.currentAoi,
  aoisList: (state) => get(state, 'context.aoisList', []),
};

export function AoiSelector() {
  const [aoiIdToSwitch, setAoiIdToSwitch] = useState(null);

  const aoiStatusMessage = ProjectMachineContext.useSelector(
    selectors.aoiStatusMessage
  );
  const currentAoi = ProjectMachineContext.useSelector(selectors.currentAoi);
  const aoisList = ProjectMachineContext.useSelector(selectors.aoisList);

  const nonSelectedAois = aoisList.filter((aoi) => aoi.id !== currentAoi?.id);

  return (
    <>
      <ConfirmAoiChangeModal
        aoiId={aoiIdToSwitch}
        setAoiIdToSwitch={setAoiIdToSwitch}
      />
      <SelectorHeadOption hasSubtitle>
        <HeadOptionHeadline usePadding>
          <Subheading>Areas of Interest</Subheading>
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
          data-cy='aoi-list'
        >
          <ActiveAoiOption
            label={currentAoi?.name || aoiStatusMessage}
            area={currentAoi?.area}
          />
          {
            // Remainder of list
            nonSelectedAois.map((aoi) => (
              <AoiOption
                key={aoi.id}
                className='listed-aoi'
                onClick={() => {
                  setAoiIdToSwitch(aoi.id);
                }}
              >
                <Heading size='xsmall'>{aoi.name}</Heading>
              </AoiOption>
            ))
          }
        </ShadowScrollbar>
        <HeadOptionToolbar>
          <AoiActionButtons />
        </HeadOptionToolbar>
      </SelectorHeadOption>
    </>
  );
}
