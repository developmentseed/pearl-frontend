import React, { useContext } from 'react';
import App from '../../common/app';

import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';
import ProjectsComponent from './projects';
import GlobalContext from '../../../context/global';

function Projects() {
  const { projectsList } = useContext(GlobalContext);

  return (
    <App pageTitle='Projects'>
      <PageHeader />
      <PageBody role='main'>
        <ProjectsComponent projectsList={projectsList} />
      </PageBody>
    </App>
  );
}

export default Projects;
