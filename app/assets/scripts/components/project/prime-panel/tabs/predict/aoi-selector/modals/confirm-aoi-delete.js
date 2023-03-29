import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { ProjectMachineContext } from '../../../../../../../context/project-xstate';
import { ModalWrapper } from '../../../../../../common/modal-wrapper';

export function ConfirmAoiDeleteModal({ revealed, setRevealed, aoiId }) {
  const actorRef = ProjectMachineContext.useActorRef();

  return (
    <Modal
      id='confirm-delete-aoi-modal'
      data-cy='confirm-delete-aoi-modal'
      revealed={revealed}
      onOverlayClick={() => setRevealed(false)}
      onCloseClick={() => setRevealed(false)}
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
            onClick={() => setRevealed(false)}
          >
            Cancel
          </Button>
          <Button
            data-cy='confirm-aoi-delete'
            variation='danger-raised-dark'
            size='medium'
            useIcon='tick'
            onClick={() => {
              actorRef.send({ type: 'Requested AOI delete', data: { aoiId } });
              setRevealed(false);
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
  revealed: PropTypes.bool,
  setRevealed: PropTypes.func,
  aoiId: PropTypes.number,
};
