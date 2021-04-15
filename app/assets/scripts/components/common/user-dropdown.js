import React, { useContext, useState } from 'react';
import { Button } from '@devseed-ui/button';
import CardList, { Card } from './card-list';
import { Modal as BaseModal } from '@devseed-ui/modal';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
  DropdownTrigger,
} from '../../styles/dropdown';
import { Heading } from '@devseed-ui/typography';
import { glsp } from '@devseed-ui/theme-provider';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel,
  FormInput,
} from '@devseed-ui/form';
import { useAuth0 } from '@auth0/auth0-react';

import { availableCheckpoints } from '../explore/sample-data';
import { filterComponentProps } from '../../styles/utils/general';
import { AuthContext } from '../../context/auth';

const Modal = styled(BaseModal)`
  .modal__contents {
    padding: 1rem;
  }
`;

const Headline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${glsp(1)};

  h1 {
    margin: 0;
  }

  ${Button} {
    height: min-content;
    align-self: center;
  }
`;

// Please refer to filterComponentProps to understand why this is needed
const propsToFilter = [
  'variation',
  'size',
  'hideText',
  'useIcon',
  'active',
  'visuallyDisabled',
];
const StyledLink = filterComponentProps(Link, propsToFilter);

function UserDropdown() {
  const location = useLocation();
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, user } = useContext(AuthContext);
  // FIXME: remove this for launch
  const isProduction = process.env.NODE_ENV === 'production';

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
          onClick={() => loginWithRedirect()}
        >
          Log in
        </Button>
      ) : (
        <Dropdown
          alignment='right'
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
              <Heading size='xsmall'>{user.name}</Heading>
            </DropdownHeader>
            <DropdownBody>
              <li>
                <DropdownItem
                  as={StyledLink}
                  to={isProduction ? '/' : '/profile/projects'}
                  useIcon='folder'
                >
                  My Projects
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  as={StyledLink}
                  to={isProduction ? '/' : '/profile/maps'}
                  useIcon='map'
                >
                  My Saved Maps
                </DropdownItem>
              </li>
              {location &&
                location.pathname &&
                location.pathname.startsWith('/explore') && (
                  <li>
                    <DropdownItem
                      useIcon='git-fork'
                      onClick={() => setShowCheckpoints(true)}
                    >
                      My Checkpoints
                    </DropdownItem>
                  </li>
                )}
              <li>
                <DropdownItem as={StyledLink} to='/' useIcon='house'>
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
        revealed={showCheckpoints}
        size='xlarge'
        onOverlayClick={() => setShowCheckpoints(false)}
        renderHeader={() => (
          <>
            <Headline>
              {' '}
              <Heading>Saved Checkpoints</Heading>
              <Button
                hideText
                variation='base-plain'
                size='small'
                useIcon='xmark'
                onClick={() => setShowCheckpoints(false)}
              >
                Close modal
              </Button>
            </Headline>
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
            filterCard={(card) => {
              return card.name.includes(checkpointFilterString.toLowerCase());
            }}
            renderCard={(ckpt) => (
              <Card
                id={ckpt.id}
                title={ckpt.name}
                details={ckpt}
                key={ckpt.id}
                cardMedia={
                  <img width='100%' src='https://place-hold.it/120x68/#dbdbd' />
                }
                expanded
              />
            )}
          />
        )}
      />
    </>
  );
}

export default UserDropdown;
