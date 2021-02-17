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
  const { restApiHealth } = useContext(GlobalContext);

  return (
    <App pageTitle='Home'>
      <PageHeader />
      <PageBody role='main'>
        <h1>Home page</h1>
        <h2>Status</h2>
        <p>API: {renderRestApiHealth(restApiHealth)}</p>
      </PageBody>
    </App>
  );
}

export default Home;
