import React from 'react';
import T from 'prop-types';
import bbox from '@turf/bbox';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import Prose from '../../../styles/type/prose';
import { useInstance } from '../../../context/instance';
import { useSessionStatus, sessionModes } from '../../../context/explore';
import { areaFromBounds } from '../../../utils/map';
import logger from '../../../utils/logger';
import { formatDateTime, formatThousands } from '../../../utils/format';
import DetailsList from '../../common/details-list';
import { AbortBatchJobButton } from '../../common/abort-batch-button';

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
`;

const Block = styled.div`
  display: block;
  padding-top: 1rem;
`;

function BatchPredictionProgressModal({
  revealed,
  disableAbortBtn,
  onCloseClick,
}) {
  const { runningBatch } = useInstance();
  const { setSessionStatusMode } = useSessionStatus();

  // Calculate AOI Area
  let batchAoiArea;
  try {
    batchAoiArea = formatThousands(
      areaFromBounds(bbox(runningBatch.bounds)) / 1e6
    );
  } catch (error) {
    logger(error);
  }

  return (
    <Modal
      id='batch-prediction-progress-modal'
      size='small'
      revealed={revealed}
      title='Batch Prediction Job Progress'
      closeButton={true}
      onCloseClick={onCloseClick}
      content={
        <Wrapper data-cy='batch-progress-modal-content'>
          <Prose className='prose'>
            Batch predictions run as a background process. You can still retrain
            smaller areas of interest (AOIs) while larger areas are running as
            batch prediction jobs.
          </Prose>
          <DetailsList
            details={{
              'Started at': formatDateTime(runningBatch.created),
              'AOI Name': runningBatch.name,
              'AOI Size': `${batchAoiArea} km²` || 'Unknown',
            }}
          />
          <Block>
            <AbortBatchJobButton
              projectId={runningBatch.project_id}
              batchId={runningBatch.id}
              disabled={disableAbortBtn}
              afterOnClickFn={() => {
                setSessionStatusMode(sessionModes.PREDICTION_READY);
                onCloseClick();
              }}
            />
          </Block>
        </Wrapper>
      }
    />
  );
}

BatchPredictionProgressModal.propTypes = {
  revealed: T.bool,
  disableAbortBtn: T.bool,
  onCloseClick: T.func,
};

export default BatchPredictionProgressModal;
