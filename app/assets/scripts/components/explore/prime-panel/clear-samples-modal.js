import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import Prose from '../../../styles/type/prose';

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
function ClearSamplesModal({ revealed, onClear, onCancel }) {
  return (
    <Modal
      id='clear-samples-modal'
      data-cy='clear-samples-modal'
      size='small'
      revealed={revealed}
      renderHeader={() => null}
      closeButton={false}
      content={
        <Wrapper>
          <Heading>Your map contains input geometry.</Heading>
          <Prose className='prose'>
            Please submit or clear your input data before changing tabs.
          </Prose>
          <Button
            variation='danger-raised-light'
            size='medium'
            useIcon='xmark--small'
            style={{
              gridColumn: '1 / 2',
            }}
            data-cy='cancel-return'
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variation='primary-raised-light'
            size='medium'
            useIcon='trash-bin'
            style={{
              gridColumn: '2 / -1',
            }}
            data-cy='clear-continue'
            onClick={onClear}
          >
            Clear Samples
          </Button>
        </Wrapper>
      }
    />
  );
}

ClearSamplesModal.propTypes = {
  revealed: T.bool,
  onClear: T.func,
  onCancel: T.func,
};
export default ClearSamplesModal;
