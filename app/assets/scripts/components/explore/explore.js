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
import { useParams } from 'react-router';
import { showGlobalLoadingMessage } from '@devseed-ui/global-loading';

import Map from './map';

import Tour from '../common/tour';

import { tourSteps } from './tour';
import { useApiMeta } from '../../context/api-meta';
import { useInstance } from '../../context/instance';
import { useAuth } from '../../context/auth';

const ExploreBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

const ExploreCarto = styled.section``;
function Explore() {
  let { projectId } = useParams();
  const { isLoading } = useAuth();

  const { apiLimits } = useApiMeta();
  const { initInstance } = useInstance();

  const [steps, setSteps] = useState(null);

  // After page is mounted and auth is resolve, init instance
  useEffect(() => {
    if (!isLoading && projectId !== 'new') {
      showGlobalLoadingMessage('Loading project...');
      initInstance(projectId);
    }
  }, [isLoading]);

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
          <ExploreCarto>
            <Map />
          </ExploreCarto>
          <SecPanel />
        </ExploreBody>
        {steps && <Tour steps={steps} />}
      </Inpage>
    </>
  );
}

if (process.env.NODE_ENV === 'development') {
  Explore.whyDidYouRender = true;
}

export default Explore;
