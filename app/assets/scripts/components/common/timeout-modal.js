import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import Prose from '../../styles/type/prose';

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
function SessionTimeoutModal({ revealed }) {
  return (
    <Modal
      id='session-timeout-modal'
      size='small'
      revealed={revealed}
      renderHeader={() => null}
      closeButton={false}
      content={
        <Wrapper>
          <Heading>Are you still working?</Heading>
          <Prose className='prose'>
            Your session will expire in 5 minutes. Extend it to keep working, or
            end it to save and exit
          </Prose>
          <Button
            variation='primary-raised-light'
            size='medium'
            useIcon='xmark--small'
            style={{
              gridColumn: '1 / 2',
            }}
          >
            End Session
          </Button>
          <Button
            variation='primary-raised-light'
            size='medium'
            useIcon='arrow-semi-spin-cw'
            style={{
              gridColumn: '2 / -1',
            }}
          >
            Extend Session
          </Button>
        </Wrapper>
      }
    />
  );
}

SessionTimeoutModal.propTypes = {
  revealed: T.bool,
};
export default SessionTimeoutModal;
