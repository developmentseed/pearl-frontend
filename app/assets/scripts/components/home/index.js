import React, { useContext } from 'react';

import App from '../common/app';
import { Link } from 'react-router-dom';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';

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
        <p>REST API Health: {renderRestApiHealth(restApiHealth)}</p>
      </PageBody>
    </App>
  );
}

export default Home;
