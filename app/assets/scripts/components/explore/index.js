import React, { useState } from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { ExploreProvider } from '../../context/explore';
import SessionOutputControl from './session-output-control';

function Explore() {
  const [projectName, setProjectName] = useState('Untitled Project');
  return (
    <App pageTitle='Explore'>
      <ExploreProvider>
        <PageHeader>
          <SessionOutputControl
            projectName={projectName}
            setProjectName={setProjectName}
          />
        </PageHeader>
        <PageBody role='main'>
          <ExploreComponent />
        </PageBody>
      </ExploreProvider>
    </App>
  );
}

export default Explore;
