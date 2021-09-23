import React from 'react';
import { Button } from '@devseed-ui/button';
import { Link } from 'react-router-dom';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
  DropdownTrigger,
} from '../../styles/dropdown';
import { Heading } from '@devseed-ui/typography';
import { useAuth0 } from '@auth0/auth0-react';
import { filterComponentProps } from '../../styles/utils/general';
import { useAuth } from '../../context/auth';

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
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, user, authStateIsLoading } = useAuth();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  if (authStateIsLoading) {
    return (
      <Button
        variation='primary-plain'
        className='button-class'
        title='Fetching login status'
      >
        Loading...
      </Button>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <Button
          variation='primary-plain'
          className='button-class'
          data-cy='login-button'
          title='log in button'
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
              variation='primary-plain'
              useIcon={['chevron-down--small', 'after']}
              usePreIcon='user'
              title='Open dropdown'
              className='user-options-trigger'
              data-cy='account-button'
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
                  to='/profile/projects'
                  useIcon='folder'
                >
                  My Projects
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  as={StyledLink}
                  to='/about'
                  useIcon='circle-information'
                >
                  User Guide
                </DropdownItem>
              </li>
              <li>
                <DropdownItem as={StyledLink} to='/' useIcon='house'>
                  Home
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
    </>
  );
}

export default UserDropdown;
