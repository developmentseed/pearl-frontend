import React, { useEffect, useState } from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { ExploreProvider } from '../../context/explore';
import { MapProvider } from '../../context/map';
import { useTour } from '../../context/tour';
import SizeAwareElement from '../common/size-aware-element';
import theme from '../../styles/theme';
import SessionTimeoutModal from '../common/timeout-modal';
import SessionOutputControl from './session-output-control';
import { CheckpointProvider } from '../../context/checkpoint';
import { AoiProvider } from '../../context/aoi';
import { useParams } from 'react-router';
import { showGlobalLoadingMessage } from '@devseed-ui/global-loading';
import { ProjectProvider } from '../../context/project';
import { InstanceProvider } from '../../context/instance';
import { PredictionsProvider } from '../../context/predictions';
import { ModelProvider } from '../../context/model';
function Explore() {
  let { projectId } = useParams();
  const { setTourStep } = useTour();
  const [isMediumDown, setIsMediumDown] = useState(false);

  const resizeListener = ({ width }) => {
    setIsMediumDown(width < theme.main.mediaRanges.large[0]);
  };

  useEffect(() => {
    if (projectId !== 'new') {
      showGlobalLoadingMessage('Loading project... ');
    }
  }, []);

  return (
    <App pageTitle='Explore'>
      <CheckpointProvider>
        <AoiProvider>
          <ModelProvider>
            <ProjectProvider>
              <PredictionsProvider>
                <InstanceProvider>
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
                </InstanceProvider>
              </PredictionsProvider>
            </ProjectProvider>
          </ModelProvider>
        </AoiProvider>
      </CheckpointProvider>
    </App>
  );
}

if (process.env.NODE_ENV === 'development') {
  Explore.whyDidYouRender = true;
}

export default Explore;
