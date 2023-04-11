import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { ProjectMachineContext } from '../../../../../../../context/project-xstate';
import { ModalWrapper } from '../../../../../../common/modal-wrapper';

export function ConfirmAoiDeleteModal({ aoiId, setAoiIdToDelete }) {
  const actorRef = ProjectMachineContext.useActorRef();

  const revealed = aoiId !== null;

  return (
    <Modal
      id='confirm-delete-aoi-modal'
      data-cy='confirm-delete-aoi-modal'
      revealed={revealed}
      onOverlayClick={() => setAoiIdToDelete(null)}
      onCloseClick={() => setAoiIdToDelete(null)}
      title='Delete AOI'
      size='small'
      content={
        <ModalWrapper>
          <div>Are you sure you want to delete this AOI?</div>
          <Button
            data-cy='cancel-aoi-delete'
            variation='primary-plain'
            size='medium'
            useIcon='xmark'
            onClick={() => setAoiIdToDelete(null)}
          >
            Cancel
          </Button>
          <Button
            data-cy='confirm-aoi-delete'
            variation='danger-raised-dark'
            size='medium'
            useIcon='tick'
            onClick={() => {
              actorRef.send({ type: 'Request AOI delete', data: { aoiId } });
              setAoiIdToDelete(null);
            }}
          >
            Delete AOI
          </Button>
        </ModalWrapper>
      }
    />
  );
}

ConfirmAoiDeleteModal.propTypes = {
  setAoiIdToDelete: PropTypes.func,
  aoiId: PropTypes.number,
};
