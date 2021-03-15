import React from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { ExploreProvider } from '../../context/explore';
import { MapProvider } from '../../context/map';

import SessionTimeoutModal from '../common/timeout-modal';
import SessionOutputControl from './session-output-control';

function Explore() {
  return (
    <App pageTitle='Explore'>
      <ExploreProvider>
        <MapProvider>
          <PageHeader>
            <SessionOutputControl />
          </PageHeader>
          <PageBody role='main'>
            <ExploreComponent />
          </PageBody>
          <SessionTimeoutModal revealed={false} />
        </MapProvider>
      </ExploreProvider>
    </App>
  );
}

export default Explore;
