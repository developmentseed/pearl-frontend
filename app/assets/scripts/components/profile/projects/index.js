import React from 'react';
import App from '../../common/app';

import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';

function Projects() {
  return (
    <App pageTitle='Projects'>
      <PageHeader />
      <PageBody role='main'>
        <h1>Projects page</h1>
      </PageBody>
    </App>
  );
}

export default Projects;
