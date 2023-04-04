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

  const {
    uploadAoi,
    addNewAoi,
    deleteAoi,
    drawNewAoi,
    cancelAoiDraw,
    confirmAoiDraw,
  } = aoiActionButtons;

  return (
    <>
      {uploadAoi && (
        <>
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
          <Separator>|</Separator>
        </>
      )}

      {addNewAoi && (
        <ActionButton
          useIcon='pencil'
          onClick={() => actorRef.send({ type: 'Pressed new AOI button' })}
          data-cy='add-aoi-button'
          title='Draw new AOI'
        >
          Add AOI
        </ActionButton>
      )}
      {deleteAoi && (
        <>
          <ActionButton
            onClick={() => setAoiIdToDelete(currentAoi?.id)}
            title='Delete Current AOI'
            id='delete-aoi'
            useIcon='trash-bin'
            data-cy='delete-current-aoi-button'
          >
            Delete Current AOI
          </ActionButton>
        </>
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

AoiActionButtons.propTypes = {
  setAoiIdToDelete: PropTypes.func,
};
