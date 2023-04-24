import React from 'react';
import { ProjectMachineContext } from '../../context/project-xstate';

import { Button } from '@devseed-ui/button';
import { Modal, ModalHeadline } from '@devseed-ui/modal';

import { ModalFooter } from '../common/custom-modal';

const selectors = {
  aoiModalDialog: (state) => state.context.aoiModalDialog,
};

export const AoiModalDialog = () => {
  const actorRef = ProjectMachineContext.useActorRef();
  const aoiModalDialog = ProjectMachineContext.useSelector(
    selectors.aoiModalDialog
  );

  // TODO there is a regression in the styles for this modal
  return (
    <Modal
      id='aoi-modal-dialog'
      revealed={aoiModalDialog.revealed}
      size='small'
      closeButton={false}
      renderHeadline={() => (
        <ModalHeadline>
          <h1>{aoiModalDialog.headline}</h1>
        </ModalHeadline>
      )}
      content={<div>{aoiModalDialog.content}</div>}
      renderFooter={() => (
        <ModalFooter>
          <Button
            size='xlarge'
            data-cy='keep-editing-button'
            variation='primary-plain'
            onClick={() =>
              actorRef.send({ type: 'Restart drawing button pressed' })
            }
          >
            Restart drawing
          </Button>
        </ModalFooter>
      )}
    />
  );
};
