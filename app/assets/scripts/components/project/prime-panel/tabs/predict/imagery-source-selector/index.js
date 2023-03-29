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
import { ImagerySourceSelectorModal } from './modal';

export const imagerySourceSelectors = {
  selectorStatus: (state) => state.context.imagerySourceSelector,
  currentImagerySource: (state) => state.context.currentImagerySource,
  imagerySourcesList: (state) => state.context.imagerySourcesList,
};

export function ImagerySourceSelector() {
  const [showModal, setShowModal] = useState(false);
  const imagerySourceSelector = ProjectMachineContext.useSelector(
    imagerySourceSelectors.selectorStatus
  );
  const currentImagerySource = ProjectMachineContext.useSelector(
    imagerySourceSelectors.currentImagerySource
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
      </HeadOption>
    </>
  );
}
