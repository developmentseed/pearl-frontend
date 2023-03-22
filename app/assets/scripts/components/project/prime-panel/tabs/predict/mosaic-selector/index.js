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

const mosaicSelectorSelector = (state) => state.context.mosaicSelector;

export function MosaicSelector() {
  const [showSelectMosaicModal, setShowSelectMosaicModal] = useState(false);

  const mosaicSelector = ProjectMachineContext.useSelector(
    mosaicSelectorSelector
  );

  return (
    <>
      <MosaicSelectorModal
        showSelectMosaicModal={showSelectMosaicModal}
        setShowSelectMosaicModal={setShowSelectMosaicModal}
      />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Base Mosaic</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          data-cy='mosaic-selector-label'
          onClick={() =>
            !mosaicSelector.disabled && setShowSelectMosaicModal(true)
          }
          title={mosaicSelector.message}
          disabled={mosaicSelector.disabled}
        >
          {mosaicSelector.message}
        </SubheadingStrong>
        <HeadOptionToolbar>
          <EditButton
            useIcon='swap-horizontal'
            id='select-mosaic-trigger'
            disabled={mosaicSelector.disabled}
            onClick={() => {
              !mosaicSelector.disabled && setShowSelectMosaicModal(true);
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
