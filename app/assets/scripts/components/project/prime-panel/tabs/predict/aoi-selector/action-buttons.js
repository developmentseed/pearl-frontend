import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { ProjectMachineContext } from '../../../../../../context/project-xstate';

import { ActionButton } from '../../../../../../styles/button';

const Separator = styled.span`
  color: ${themeVal('color.baseAlphaD')};
`;

const selectors = {
  aoiActionButtons: (state) => state.context.aoiActionButtons,
  currentAoi: (state) => state.context.currentAoi,
};

export function AoiActionButtons({ setAoiIdToDelete }) {
  const actorRef = ProjectMachineContext.useActorRef();
  const aoiActionButtons = ProjectMachineContext.useSelector(
    selectors.aoiActionButtons
  );
  const currentAoi = ProjectMachineContext.useSelector(selectors.currentAoi);

  // These are the button types available, defined at the state machine. Most of
  // them are self-explanatory, but the "drawFirstAoi" is a special case. It's
  // only available when there are no AOIs in the project, and it's used to draw
  // the first AOI. After that, the "addNewAoi" button is used to draw new AOIs.
  const {
    uploadAoi,
    drawFirstAoi,
    addNewAoi,
    editAoi,
    deleteAoi,
    cancelAoiDraw,
    confirmAoiDraw,
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
      {addNewAoi && (
        <ActionButton
          useIcon='plus'
          onClick={() => actorRef.send({ type: 'Pressed new AOI button' })}
          data-cy='add-new-aoi-button'
          title='Draw new AOI'
        >
          Add AOI
        </ActionButton>
      )}
      {(uploadAoi || addNewAoi) && <Separator>|</Separator>}
      {drawFirstAoi && (
        <ActionButton
          useIcon='pencil'
          onClick={() => {
            actorRef.send({
              type: 'Pressed draw first AOI button',
            });
          }}
          data-cy='draw-first-aoi-button'
          title='Draw first AOI'
        >
          Add AOI
        </ActionButton>
      )}

      {deleteAoi && (
        <>
          <ActionButton
            onClick={() => setAoiIdToDelete(currentAoi?.id)}
            title='Delete Current AOI'
            id='delete-current-aoi'
            useIcon='trash-bin'
            data-cy='delete-current-aoi-button'
          >
            Delete Current AOI
          </ActionButton>
        </>
      )}
      {editAoi && (
        <ActionButton
          title='Edit Area of Interest'
          id='edit-aoi-trigger'
          useIcon='pencil'
          data-cy='edit-current-aoi-button'
          onClick={() => {
            actorRef.send({
              type: 'Pressed edit AOI button',
            });
          }}
        >
          Edit current AOI
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

AoiActionButtons.propTypes = {
  setAoiIdToDelete: PropTypes.func,
};
