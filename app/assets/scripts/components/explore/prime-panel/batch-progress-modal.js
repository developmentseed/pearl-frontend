import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import Prose from '../../../styles/type/prose';
import { useInstance } from '../../../context/instance';
import { formatDateTime } from '../../../utils/format';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  h1 {
    grid-column: 1 / -1;
  }
  div.prose {
    grid-column: 1 / -1;
  }
  grid-gap: 1rem;
`;

function BatchPredictionProgressModal({ revealed, onCloseClick }) {
  const { runningBatch } = useInstance();

  return (
    <Modal
      id='batch-prediction-progress-modal'
      size='small'
      revealed={revealed}
      renderHeader={() => null}
      closeButton={false}
      content={
        <Wrapper>
          <Heading>Batch Prediction Job Progress</Heading>
          <Prose data-cy='batch-progress-modal-content' className='prose'>
            Batch predictions runs as a background process. You can still
            retrain smaller areas of interest (AOIs) while larger areas are
            running as batch prediction jobs.
            <ul>
              <li>Job started: {formatDateTime(runningBatch.created)}</li>
            </ul>
          </Prose>
          <Button
            data-cy='close-batch-prediction-modal'
            variation='primary-plain'
            size='medium'
            useIcon='xmark--small'
            style={{
              gridColumn: '1 / 2',
            }}
            onClick={onCloseClick}
          >
            Close this
          </Button>
        </Wrapper>
      }
    />
  );
}

BatchPredictionProgressModal.propTypes = {
  revealed: T.bool,
  onCloseClick: T.func,
};

export default BatchPredictionProgressModal;
