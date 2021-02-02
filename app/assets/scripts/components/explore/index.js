import React from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
//import Button from '../../styles/button/button';
import { Button } from '@devseed-ui/button';

function Explore() {
  return (
    <App pageTitle='Explore'>
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
      </PageHeader>
      <PageBody role='main'>
        <ExploreComponent />
      </PageBody>
    </App>
  );
}

export default Explore;
