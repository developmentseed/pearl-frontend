import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
} from '../../styles/inpage';
import PrimePanel from './prime-panel';
import SecPanel from './sec-panel';
import Map from './map';
import Tour from '../common/tour';
import { tourSteps } from './tour';
import { useApiLimits } from '../../context/global';
import { useSessionStatus } from '../../context/explore';
import { sessionModes } from '../../context/explore/session-status';
import { useParams } from 'react-router-dom';
import LayersPanel from './layers-panel';

const ExploreBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

const ExploreCarto = styled.section``;
function Explore() {
  const { apiLimits } = useApiLimits();
  const { projectId } = useParams();
  const { sessionStatus } = useSessionStatus();
  const [steps, setSteps] = useState(null);

  const isLoading = [
    sessionModes.LOADING,
    sessionModes.LOADING_PROJECT,
    sessionModes.SET_PROJECT_NAME,
  ].includes(sessionStatus.mode);

  useEffect(() => {
    if (apiLimits) {
      const steps = tourSteps.map((s) => {
        const content = s.content
          .replace('{LIVE_INFERENCE_MAX_AREA}', apiLimits.live_inference / 1e6)
          .replace('{INFERENCE_MAX_AREA}', apiLimits.max_inference / 1e6);

        return { ...s, content };
      });
      setSteps(steps);
    }
  }, [apiLimits]);

  useEffect(() => {
    if (projectId !== 'new') {
      tourSteps.splice(1, 4);
      setSteps(tourSteps);
    }
  }, [projectId]);

  return (
    <>
      <Inpage isMapCentric>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Explore</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <ExploreBody>
          <PrimePanel />
          <ExploreCarto id='welcome-trigger'>
            <Map />
          </ExploreCarto>
          <LayersPanel parentId='layer-control' className='padded' />
          <SecPanel />
        </ExploreBody>
        {steps && !isLoading && <Tour steps={steps} />}
      </Inpage>
    </>
  );
}

if (process.env.NODE_ENV === 'development') {
  Explore.whyDidYouRender = true;
}

export default Explore;
