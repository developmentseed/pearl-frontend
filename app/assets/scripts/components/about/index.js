import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';

import App from '../common/app';

class About extends React.Component {
  render() {
    return (
      <App pageTitle='About'>
        <PageHeader />
        <PageBody role='main'>
          <h1>About</h1>
          <Link to='/'>
            <strong>Go to home</strong>
          </Link>
        </PageBody>
      </App>
    );
  }
}

export default About;
