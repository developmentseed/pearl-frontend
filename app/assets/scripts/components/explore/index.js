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
            variation='base-plain'
            useIcon='circle-question'
            title='App help'
          >
            <span>Help</span>
          </Button>

          <Button
            variation='primary-raised-light'
            useIcon='download-2'
            title='Set this option'
          >
            <span>Export</span>
          </Button>
          <Button
            variation='primary-raised-dark'
            useIcon='square'
            title='Set this option'
          >
            <span>Save Project</span>
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
