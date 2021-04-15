import React from 'react';
import App from '../../common/app';

import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';
import ProjectComponent from './project';

function Project() {
  return (
    <App pageTitle='Project'>
      <PageHeader />
      <PageBody role='main'>
        <ProjectComponent />
      </PageBody>
    </App>
  );
}

export default Project;