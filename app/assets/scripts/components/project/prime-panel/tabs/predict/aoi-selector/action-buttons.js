import React from 'react';
import { ProjectMachineContext } from '../../../../../../context/project-xstate';

import { ActionButton } from '../../../../../../styles/button';

const aoiActionButtonsSelector = (state) => state.context.aoiActionButtons;

export function AoiActionButtons() {
  const actorRef = ProjectMachineContext.useActorRef();
  const aoiActionButtons = ProjectMachineContext.useSelector(
    aoiActionButtonsSelector
  );

  const {
    drawNewAoi,
    cancelAoiDraw,
    confirmAoiDraw,
    uploadAoi,
  } = aoiActionButtons;

  return (
    <>
      {uploadAoi && (
        <ActionButton
          title='Upload AOI GeoJSON'
          data-cy='upload-aoi-button'
          id='upload-aoi-button'
          useIcon='upload'
          onClick={() => {
            actorRef.send({
              type: 'Pressed upload AOI button',
            });
          }}
        >
          Upload AOI
        </ActionButton>
      )}
      {drawNewAoi && (
        <ActionButton
          title='Draw Area of Interest'
          id='edit-aoi-trigger'
          useIcon='pencil'
          data-cy='aoi-edit-button'
          onClick={() => {
            actorRef.send({
              type: 'Pressed draw new AOI button',
            });
          }}
        >
          Draw new AOI
        </ActionButton>
      )}
      {confirmAoiDraw && (
        <ActionButton
          title='Confirm AOI Draw'
          id='confirm-aoi-draw-button'
          useIcon='tick--small'
          data-cy='confirm-aoi-draw-button'
          onClick={() => {
            actorRef.send({
              type: 'Pressed confirm AOI draw button',
            });
          }}
        >
          Confirm AOI draw
        </ActionButton>
      )}
      {cancelAoiDraw && (
        <ActionButton
          title='Cancel AOI Draw'
          id='cancel-aoi-draw-button'
          useIcon='xmark'
          data-cy='cancel-aoi-draw-button'
          onClick={() => {
            actorRef.send({
              type: 'Pressed cancel AOI draw button',
            });
          }}
        >
          Cancel AOI draw
        </ActionButton>
      )}
    </>
  );
}
