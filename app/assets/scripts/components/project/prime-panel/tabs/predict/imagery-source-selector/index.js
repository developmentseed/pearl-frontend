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
import * as guards from '../../../../../../fsm/project/guards';
import { SESSION_MODES } from '../../../../../../fsm/project/constants';

export function ImagerySourceSelector() {
  const [showModal, setShowModal] = useState(false);
  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const currentAoi = ProjectMachineContext.useSelector(selectors.currentAoi);
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const isProjectNew = ProjectMachineContext.useSelector((s) =>
    guards.isProjectNew(s.context)
  );

  let label;
  let disabled = true;
  if (sessionMode === SESSION_MODES.LOADING) {
    label = 'Loading...';
    disabled = true;
  } else if (isProjectNew) {
    if (!currentAoi) {
      label = 'Define first AOI';
      disabled = true;
    } else {
      label = !currentImagerySource
        ? 'Select Imagery Source'
        : currentImagerySource.name;
      disabled = false;
    }
  } else {
    label = currentImagerySource?.name || '';
    disabled = true;
  }

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
              onClick={() => setShowModal(true)}
              title='Select Imagery ImagerySource'
            >
              Edit Imagery Source Selection
            </EditButton>
          </HeadOptionToolbar>
        )}
      </HeadOption>
    </>
  );
}
