import React from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import Button from '../../styles/button/button';

function Explore(props) {
  return (
    <App pageTitle='Explore'>
      <PageHeader>
        <Button
          variation='base-raised-light'
          useIcon='house'
          title='Set this option'
        >
          <span>A button</span>
        </Button>
      </PageHeader>
      <PageBody role='main'>
        <ExploreComponent />
      </PageBody>
    </App>
  );
}

export default Explore;
