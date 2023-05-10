import React from 'react';
import { ProjectMachineContext } from '../../context/project-xstate';

import { Button } from '@devseed-ui/button';
import { Modal, ModalHeadline } from '@devseed-ui/modal';

import { ModalFooter } from '../common/custom-modal';
import config from '../../config';
import { formatThousands } from '../../utils/format';

const selectors = {
  isRevealed: (state) => state.context.aoiAreaModalDialogRevealed,
  aoiArea: (state) => state.context.currentAoi?.area,
  maxInferenceArea: (state) => state.context.apiLimits?.max_inference,
  liveInferenceArea: (state) => state.context.apiLimits?.live_inference,
  apiLimits: (state) => state.context.apiLimits,
};

export const AoiModalDialog = () => {
  const actorRef = ProjectMachineContext.useActorRef();
  const isRevealed = ProjectMachineContext.useSelector(selectors.isRevealed);
  const aoiArea = ProjectMachineContext.useSelector(selectors.aoiArea);
  const maxInferenceArea = ProjectMachineContext.useSelector(
    selectors.maxInferenceArea
  );
  const liveInferenceArea = ProjectMachineContext.useSelector(
    selectors.liveInferenceArea
  );

  let headline;
  let content;
  let proceedButton;
  const formattedAoiArea = formatThousands(aoiArea / 1e6, { decimals: 1 });
  if (aoiArea < config.minimumAoiArea) {
    headline = 'Area is too small';
    content = `The AOI area is ${formattedAoiArea} km², please select an
    area greater than ${config.minimumAoiArea / 1e6} km².`;
  } else if (aoiArea > maxInferenceArea) {
    headline = 'Area is too large';
    content = `The AOI area is ${formattedAoiArea} km², please select an
    area smaller than ${maxInferenceArea / 1e6} km².`;
  } else {
    headline = 'Save Area For Batch Prediction';
    content = `Live inference is not available for areas larger than ${
      liveInferenceArea / 1e6
    } km². You can run inference on this AOI as a background process, or resize to a smaller size to engage in retraining and run live inference.`;
    proceedButton = true;
  }

  // TODO there is a regression in the styles for this modal
  return (
    <Modal
      id='aoi-modal-dialog'
      revealed={isRevealed}
      size='small'
      closeButton={false}
      renderHeadline={() => (
        <ModalHeadline>
          <h1>{headline}</h1>
        </ModalHeadline>
      )}
      content={<div>{content}</div>}
      renderFooter={() => (
        <ModalFooter>
          {proceedButton && (
            <Button
              size='xlarge'
              variation='base-plain'
              data-cy='proceed-anyway-button'
              onClick={() => actorRef.send({ type: 'Proceed button pressed' })}
            >
              Proceed anyway
            </Button>
          )}
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
