import React, { useState } from 'react';
import { ProjectMachineContext } from '../../../../../../context/project-xstate';
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
import { MosaicSelectorModal } from './modal';

export const mosaicsSelectors = {
  selectorStatus: (state) => state.context.mosaicSelector,
  currentMosaic: (state) => state.context.currentMosaic,
  mosaicsList: (state) => state.context.mosaicsList,
};

export function MosaicSelector() {
  const [showModal, setShowModal] = useState(false);

  const mosaicSelector = ProjectMachineContext.useSelector(
    mosaicsSelectors.selectorStatus
  );
  const currentMosaic = ProjectMachineContext.useSelector(
    mosaicsSelectors.currentMosaic
  );

  const { disabled } = mosaicSelector;

  const label = currentMosaic?.name || mosaicSelector.message;

  return (
    <>
      <MosaicSelectorModal showModal={showModal} setShowModal={setShowModal} />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Base Mosaic</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          data-cy='mosaic-selector-label'
          onClick={() => !disabled && setShowModal(true)}
          title={label}
          disabled={disabled}
        >
          {label}
        </SubheadingStrong>
        <HeadOptionToolbar>
          <EditButton
            useIcon='swap-horizontal'
            id='select-mosaic-trigger'
            disabled={disabled}
            onClick={() => {
              !disabled && setShowModal(true);
            }}
            title='Select Imagery Mosaic'
          >
            Edit Mosaic Selection
          </EditButton>
        </HeadOptionToolbar>
      </HeadOption>
    </>
  );
}
