import React from 'react';
import { ProjectMachineContext } from '../../../../../../context/project-xstate';

import { EditButton } from '../../../../../../styles/button';

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

  const { drawNewAoi, cancelAoiDraw } = aoiActionButtons;

  return (
    <>
      {drawNewAoi !== aoiActionButtonModes.HIDDEN && (
        <EditButton
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
        </EditButton>
      )}
      {cancelAoiDraw !== aoiActionButtonModes.HIDDEN && (
        <EditButton
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
        </EditButton>
      )}
    </>
  );
}
