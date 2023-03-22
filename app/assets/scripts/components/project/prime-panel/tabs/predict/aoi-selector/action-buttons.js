import React from 'react';
import { ProjectMachineContext } from '../../../../../../context/project-xstate';

import { ActionButton, EditButton } from '../../../../../../styles/button';

export const aoiActionButtonModes = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  HIDDEN: 'HIDDEN',
};

const aoiActionButtonsSelector = (state) => state.context.aoiActionButtons;

export function AoiActionButtons() {
  const actorRef = ProjectMachineContext.useActorRef();
  const aoiActionButtons = ProjectMachineContext.useSelector(
    aoiActionButtonsSelector
  );

  const { drawNewAoi, cancelAoiDraw, confirmAoiDraw } = aoiActionButtons;

  return (
    <>
      {drawNewAoi !== aoiActionButtonModes.HIDDEN && (
        <ActionButton
          title='Draw Area of Interest'
          id='edit-aoi-trigger'
          useIcon='pencil'
          data-cy='aoi-edit-button'
          onClick={() => {
            actorRef.send({
              type: 'Clicked draw new AOI button',
            });
          }}
        >
          Draw new AOI
        </ActionButton>
      )}
      {confirmAoiDraw !== aoiActionButtonModes.HIDDEN && (
        <ActionButton
          title='Confirm AOI Draw'
          id='confirm-aoi-draw-button'
          useIcon='tick--small'
          data-cy='confirm-aoi-draw-button'
          onClick={() => {
            actorRef.send({
              type: 'Clicked confirm AOI draw button',
            });
          }}
        >
          Confirm AOI draw
        </ActionButton>
      )}
      {cancelAoiDraw !== aoiActionButtonModes.HIDDEN && (
        <ActionButton
          title='Cancel AOI Draw'
          id='cancel-aoi-draw-button'
          useIcon='xmark'
          data-cy='cancel-aoi-draw-button'
          onClick={() => {
            actorRef.send({
              type: 'Clicked cancel AOI draw button',
            });
          }}
        >
          Cancel AOI draw
        </ActionButton>
      )}
    </>
  );
}
