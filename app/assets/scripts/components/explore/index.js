import React, { useContext } from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { ExploreProvider } from '../../context/explore';
import SessionTimeoutModal from '../common/timeout-modal';
import SessionOutputControl from './session-output-control';
import GlobalContext from '../../context/global';

function Explore() {
  const { currentProjectName, setCurrentProjectName, setTourStep } = useContext(
    GlobalContext
  );
  return (
    <App pageTitle='Explore'>
      <ExploreProvider>
        <PageHeader>
          <SessionOutputControl
            projectName={currentProjectName || 'Untitled Project'}
            setProjectName={setCurrentProjectName}
            openHelp={() => setTourStep(0)}
          />
        </PageHeader>
        <PageBody role='main'>
          <ExploreComponent />
        </PageBody>
        <SessionTimeoutModal revealed={false} />
      </ExploreProvider>
    </App>
  );
}

export default Explore;
