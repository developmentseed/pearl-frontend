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
import { useApiMeta } from '../../context/api-meta';

const ExploreBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

const ExploreCarto = styled.section``;
function Explore() {
  const { apiLimits } = useApiMeta();

  const [steps, setSteps] = useState(null);

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
