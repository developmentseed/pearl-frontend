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
import { ImagerySourceSelectorModal } from './modal';
import selectors from '../../../../../../fsm/project/selectors';

export function ImagerySourceSelector() {
  const [showModal, setShowModal] = useState(false);
  const imagerySourceSelector = ProjectMachineContext.useSelector(
    selectors.imagerySourceSelectorStatus
  );
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );

  const { disabled } = imagerySourceSelector;

  const label =
    currentImagerySource?.name || imagerySourceSelector.placeholderLabel;

  return (
    <>
      <ImagerySourceSelectorModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Imagery Source</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          data-cy='imagery-selector-label'
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
              onClick={() => setShowModal(true)}
              title='Select Imagery ImagerySource'
            >
              Edit Imagery ImagerySource Selection
            </EditButton>
          </HeadOptionToolbar>
        )}
      </HeadOption>
    </>
  );
}
