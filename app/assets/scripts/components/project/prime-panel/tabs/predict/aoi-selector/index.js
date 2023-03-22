import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import { AoiActionButtons } from './action-buttons';
import {
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../../styles/panel';
import { Subheading } from '../../../../../../styles/type/heading';
import ShadowScrollbar from '../../../../../common/shadow-scrollbar';

import { aoiStatuses } from '../../../../../../context/project-xstate/machine';
import { ProjectMachineContext } from '../../../../../../context/project-xstate';
import { SelectorHeadOption, SelectorOption } from '../../../selection-styles';
import { formatThousands } from '../../../../../../utils/format';

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

const selectors = {
  aoiStatusMessage: (state) => state.context.aoiStatusMessage,
  currentAoi: (state) => state.context.currentAoi,
};

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

export function AoiSelector() {
  const aoiStatusMessage = ProjectMachineContext.useSelector(
    selectors.aoiStatusMessage
  );
  const currentAoi = ProjectMachineContext.useSelector(selectors.currentAoi);

  // TODO fix selector title

  return (
    <>
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
        </ShadowScrollbar>
        <HeadOptionToolbar>
          <AoiActionButtons />
        </HeadOptionToolbar>
      </SelectorHeadOption>
    </>
  );
}
