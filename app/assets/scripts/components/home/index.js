import React, { useContext } from 'react';

import App from '../common/app';
import { Link } from 'react-router-dom';

import GlobalContext from '../../context/global';

import { useAuth0 } from '@auth0/auth0-react';

import { Button } from '@devseed-ui/button';

function renderRestApiHealth(restApiHealth) {
  const { isReady, hasError, getData } = restApiHealth;

  if (!isReady()) return 'Fetching...';

  if (hasError()) return 'Unavailable.';

  return getData().message || 'Ok';
}

function Home() {
  const { restApiHealth } = useContext(GlobalContext);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <App pageTitle='Home'>
      <h1>Home</h1>
      <h2>Available Pages</h2>
      <ul>
        <li>
          <Link to='/explore'>Explore</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
      </ul>
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
          <p>{JSON.stringify(user)}</p>
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
    </App>
  );
}

export default Home;
