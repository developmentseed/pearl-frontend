import React, { useContext } from 'react';
import App from '../common/app';
import { useAuth0 } from '@auth0/auth0-react';

import { Button } from '@devseed-ui/button';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { StyledNavLink } from '../../styles/link';

import GlobalContext from '../../context/global';

function renderRestApiHealth(restApiHealth) {
  const { isReady, hasError, getData } = restApiHealth;
  if (!isReady()) return 'Fetching...';
  if (hasError()) return 'Unavailable.';
  return getData().message || 'Ok';
}

function Home() {
  const { restApiHealth, apiToken } = useContext(GlobalContext);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <App pageTitle='Home'>
      <PageHeader>
        <Button
          as={StyledNavLink}
          to='/about'
          variation='base-raised-semidark'
          useIcon='circle-information'
          title='Visit About page'
          size='small'
        >
          <span>About</span>
        </Button>
        <Button
          as={StyledNavLink}
          to='/explore'
          variation='base-raised-semidark'
          useIcon='globe'
          title='Launch application'
          size='small'
        >
          <span>Launch Application</span>
        </Button>
      </PageHeader>

      <PageBody role='main'>
        <h1>Home page</h1>
        <h2>Status</h2>
        <p>API: {renderRestApiHealth(restApiHealth)}</p>
        {!isAuthenticated && (
          <>
            <Button
              variation='base-raised-light'
              size='medium'
              className='button-class'
              title='sample button'
              onClick={() => loginWithRedirect()}
            >
              Log in
            </Button>
          </>
        )}
        {isAuthenticated && (
          <>
            <h2>Logged user</h2>
            <ul>
              {Object.keys(user).map((key) => (
                <li key={key}>
                  {key}: {user[key]}
                </li>
              ))}
            </ul>
            <h2>API Token</h2>
            <p>{apiToken || 'Loading...'}</p>
            <Button
              variation='base-raised-light'
              size='medium'
              className='button-class'
              title='sample button'
              onClick={() => logoutWithRedirect()}
            >
              Log out
            </Button>
          </>
        )}
      </PageBody>
    </App>
  );
}

export default Home;
