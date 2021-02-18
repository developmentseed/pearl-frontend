import React from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { Button } from '@devseed-ui/button';
import { ExploreProvider } from '../../context/explore';

function Explore() {
  return (
    <App pageTitle='Explore'>
      <ExploreProvider>
        <PageHeader>
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
          </Button>
        </PageHeader>
        <PageBody role='main'>
          <ExploreComponent />
        </PageBody>
      </ExploreProvider>
    </App>
  );
}

export default Explore;
