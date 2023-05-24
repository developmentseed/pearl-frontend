import React, { useState } from 'react';
import { ProjectMachineContext } from '../../../../../../fsm/project';
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
import selectors from '../../../../../../fsm/project/selectors';

export function MosaicSelector() {
  const [showModal, setShowModal] = useState(false);

  const mosaicSelector = ProjectMachineContext.useSelector(
    selectors.mosaicSelectorStatus
  );
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const currentMosaic = ProjectMachineContext.useSelector(
    selectors.currentMosaic
  );

  const disabled = mosaicSelector?.disabled || !currentImagerySource;

  const label = currentMosaic?.name || mosaicSelector.placeholderLabel;

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
        {!disabled && (
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
        )}
      </HeadOption>
    </>
  );
}
