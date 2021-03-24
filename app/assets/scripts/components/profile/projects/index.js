import React from 'react';
import App from '../../common/app';

import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';
import ProjectsComponent from './projects';

function Projects() {
  return (
    <App pageTitle='Projects'>
      <PageHeader />
      <PageBody role='main'>
        <ProjectsComponent />
      </PageBody>
    </App>
  );
}

export default Projects;
