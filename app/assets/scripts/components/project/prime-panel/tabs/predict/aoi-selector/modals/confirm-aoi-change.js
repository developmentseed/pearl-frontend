import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { ProjectMachineContext } from '../../../../../../../fsm/project';
import { ModalWrapper } from '../../../../../../common/modal-wrapper';

export function ConfirmAoiChangeModal({ aoiId, setAoiIdToSwitch }) {
  const actorRef = ProjectMachineContext.useActorRef();

  const revealed = aoiId !== null;

  return (
    <Modal
      id='confirm-clear-aoi-modal'
      data-cy='confirm-clear-aoi-modal'
      revealed={revealed}
      onOverlayClick={() => setAoiIdToSwitch(null)}
      onCloseClick={() => setAoiIdToSwitch(null)}
      title='Unsaved AOI'
      size='small'
      content={
        <ModalWrapper>
          <div>
            You have not submitted the drawn AOI for predictions. Switching to a
            new AOI will remove this unsaved AOI.
          </div>
          <Button
            data-cy='cancel-clear-aoi'
            variation='primary-plain'
            size='medium'
            useIcon='xmark'
            onClick={() => {
              setAoiIdToSwitch(null);
            }}
          >
            Cancel
          </Button>
          <Button
            data-cy='confirm-clear-aoi'
            variation='danger-raised-dark'
            size='medium'
            useIcon='trash-bin'
            onClick={() => {
              actorRef.send({
                type: 'Requested AOI switch',
                data: { aoiId },
              });
              setAoiIdToSwitch(null);
            }}
          >
            Clear AOI
          </Button>
        </ModalWrapper>
      }
    />
  );
}

ConfirmAoiChangeModal.propTypes = {
  setAoiIdToSwitch: PropTypes.func,
  aoiId: PropTypes.number,
};
