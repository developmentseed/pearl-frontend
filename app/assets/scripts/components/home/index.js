import React from 'react';

import App from '../common/app';
import { Link } from 'react-router-dom';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';

function Home() {
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
      </PageBody>
    </App>
  );
}

export default Home;
