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
import { SESSION_MODES } from '../../../../../../fsm/project/constants';
import selectors from '../../../../../../fsm/project/selectors';
import * as guards from '../../../../../../fsm/project/guards';

export function MosaicSelector() {
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

  let label;
  let disabled = true;
  if (sessionMode === SESSION_MODES.LOADING) {
    label = 'Loading...';
  } else if (!currentAoi || !currentAoi.name) {
    label = 'Define first AOI';
  } else if (!currentImagerySource) {
    label = 'Define Imagery Source';
  } else {
    label = currentMosaic?.name || 'Select Mosaic';
    disabled = false;
  }

  return (
    <>
      <MosaicSelectorModal
        showModal={showModal}
        setShowModal={setShowModal}
        isProjectNew={isProjectNew}
      />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Imagery Mosaic Date Range</Subheading>
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
