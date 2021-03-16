import React, { useContext } from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { ExploreProvider } from '../../context/explore';
import { MapProvider } from '../../context/map';
import GlobalContext from '../../context/global';

import SessionTimeoutModal from '../common/timeout-modal';
import SessionOutputControl from './session-output-control';

function Explore() {
  const { setTourStep } = useContext(GlobalContext);
  return (
    <App pageTitle='Explore'>
      <ExploreProvider>
        <MapProvider>
          <PageHeader>
            <SessionOutputControl openHelp={() => setTourStep(0)} />
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
