import React, { useContext, useState } from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { ExploreProvider } from '../../context/explore';
import { MapProvider } from '../../context/map';
import GlobalContext from '../../context/global';
import SizeAwareElement from '../common/size-aware-element';
import theme from '../../styles/theme';
import SessionTimeoutModal from '../common/timeout-modal';
import SessionOutputControl from './session-output-control';
import { CheckpointProvider } from '../../context/checkpoint';

function Explore() {
  const { setTourStep } = useContext(GlobalContext);
  const [isMediumDown, setIsMediumDown] = useState(false);

  const resizeListener = ({ width }) => {
    setIsMediumDown(width < theme.main.mediaRanges.large[0]);
  };

  return (
    <App pageTitle='Explore'>
      <CheckpointProvider>
        <ExploreProvider>
          <MapProvider>
            <SizeAwareElement
              element='header'
              className='header'
              onChange={resizeListener}
            >
              <PageHeader>
                <SessionOutputControl
                  openHelp={() => setTourStep(0)}
                  isMediumDown={isMediumDown}
                />
              </PageHeader>
            </SizeAwareElement>
            <PageBody role='main'>
              <ExploreComponent />
            </PageBody>
            <SessionTimeoutModal revealed={false} />
          </MapProvider>
        </ExploreProvider>
      </CheckpointProvider>
    </App>
  );
}

export default Explore;
