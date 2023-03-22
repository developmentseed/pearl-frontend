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

const imagerySourceSelectorSelector = (state) =>
  state.context.imagerySourceSelector;

export function ImagerySourceSelector() {
  const [showModal, setShowModal] = useState(false);
  const imagerySourceSelector = ProjectMachineContext.useSelector(
    imagerySourceSelectorSelector
  );

  const { message, disabled } = imagerySourceSelector;

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
          title={message}
          disabled={disabled}
        >
          {message}
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
