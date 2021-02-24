import React, { useState } from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { Button } from '@devseed-ui/button';
import { ExploreProvider } from '../../context/explore';
import SessionOutputControl from './session-output-control';

function Explore() {
  const [ projectName, setProjectName ] = useState('Untitled Project');
  return (
    <App pageTitle='Explore'>
      <ExploreProvider>
        <PageHeader>
          <SessionOutputControl
            projectName={projectName}
            setProjectName={setProjectName}
          />

    {/*
          <Button
            variation='base-raised-semidark'
            useIcon='square'
            title='Set this option'
            size='small'
          >
            <span>Save Checkpoint</span>
          </Button>

          <Button
            variation='base-raised-semidark'
            useIcon='download-2'
            title='Set this option'
            size='small'
          >
            <span>Download</span>
          </Button>
          <Button
            variation='base-raised-semidark'
            useIcon='circle-question'
            title='App help'
            size='small'
          >
            <span>Help</span>
          </Button>*/}
        </PageHeader>
        <PageBody role='main'>
          <ExploreComponent />
        </PageBody>
      </ExploreProvider>
    </App>
  );
}

export default Explore;
