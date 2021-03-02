import React, { useState } from 'react';
import { Button } from '@devseed-ui/button';
import CardList from './card-list';
import { Modal as BaseModal } from '@devseed-ui/modal';
import styled from 'styled-components';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
  DropdownTrigger,
} from '../../styles/dropdown';
import { Heading } from '@devseed-ui/typography';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel,
  Field,
  FormInput,
} from '@devseed-ui/form';
import { useAuth0 } from '@auth0/auth0-react';
import SelectModal from './select-modal';

import { Card } from '../common/card-list';

import { availableCheckpoints } from '../explore/sample-data';

const Modal = styled(BaseModal)`
  .modal__contents {
    padding: 1rem;
  }
`;

function UserDropdown(props) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  const [showCheckpoints, setShowCheckpoints] = useState(false);
  const [checkpointFilterString, setCheckpointFilterString] = useState('');

  return (
    <>
      {!isAuthenticated ? (
        <Button
          variation='primary-raised-light'
          className='button-class'
          title='sample button'
          onClick={() => loginWithRedirect({ prompt: 'consent' })}
        >
          Log in
        </Button>
      ) : (
        <Dropdown
          alignment='center'
          direction='down'
          triggerElement={(props) => (
            <DropdownTrigger
              variation='primary-raised-light'
              useIcon={['chevron-down--small', 'after']}
              usePreIcon='user'
              title='Open dropdown'
              className='user-options-trigger'
              size='medium'
              {...props}
            >
              Account
            </DropdownTrigger>
          )}
          className='global__dropdown'
        >
          <>
            <DropdownHeader>
              <p>Hello</p>
              <h1>Sylvan Couvert</h1>
            </DropdownHeader>
            <DropdownBody>
              <li>
                <DropdownItem useIcon='folder'>My Projects</DropdownItem>
              </li>
              <li>
                <DropdownItem useIcon='map'>My Saved Maps</DropdownItem>
              </li>
              <li>
                <DropdownItem
                  useIcon='git-fork'
                  onClick={() => setShowCheckpoints(true)}
                >
                  My Checkpoints
                </DropdownItem>
              </li>
              <li>
                <DropdownItem useIcon='house' to='/'>
                  Visit Homepage
                </DropdownItem>
              </li>
            </DropdownBody>
            <DropdownFooter>
              <DropdownItem
                useIcon='logout'
                onClick={() => logoutWithRedirect()}
              >
                Sign Out
              </DropdownItem>
            </DropdownFooter>
          </>
        </Dropdown>
      )}
      <Modal
        id='checkpoints-modal'
        revealed={true || showCheckpoints}
        size='xlarge'
        onOverlayClick={() => setShowCheckpoints(false)}
        renderHeader={() => (
          <>
            <Heading>Saved Checkpoints</Heading>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel htmlFor='checkpoint-filter'>
                  Search Checkpoints
                </FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormInput
                  type='text'
                  id='checkpoint-filter'
                  name='checkpoint-filter'
                  onChange={(e) => setCheckpointFilterString(e.target.value)}
                  placeholder='Filter checkpoints'
                />
              </FormGroupBody>
            </FormGroup>
          </>
        )}
        renderBody={() => (
          <CardList
            numColumns={3}
            style={{ height: '45vh' }}
            data={availableCheckpoints}
            renderCard={(ckpt) => (
              <Card
                id={ckpt.id}
                title={ckpt.name}
                details={ckpt}
                key={ckpt.key}
                cardMedia={<img src='https://place-hold.it/120x68/#dbdbd' />}
                expanded
              />
            )}
            filterCard={() => true}
          />
        )}
      />
    </>
  );
}

export default UserDropdown;
