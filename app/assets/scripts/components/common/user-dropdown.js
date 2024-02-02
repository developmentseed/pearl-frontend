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
  const {
    isAuthenticated,
    userAccessLevel,
    user,
    authStateIsLoading,
    login,
    logout,
  } = useAuth();

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
          onClick={() => login()}
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
                <DropdownItem as={StyledLink} to='/public-maps' useIcon='map'>
                  Public Maps
                </DropdownItem>
              </li>
              {userAccessLevel === 'admin' && (
                <>
                  <li>
                    <DropdownItem
                      as={StyledLink}
                      to='/admin/models'
                      useIcon='folder'
                      data-cy='manage-models-link'
                    >
                      Manage Models
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem
                      as={StyledLink}
                      to='/admin/users'
                      useIcon='user'
                      data-cy='manage-users-link'
                    >
                      Manage Users
                    </DropdownItem>
                  </li>
                </>
              )}
            </DropdownBody>
            <DropdownFooter>
              <DropdownItem useIcon='logout' onClick={logout}>
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
