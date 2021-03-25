import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
} from '../../styles/inpage';
import Panel from '../common/panel';
import PrimePanel from './prime-panel';
import Map from './map';

import Tour from '../common/tour';
import GlobalContext from '../../context/global';
import { ExploreContext } from '../../context/explore';
import { CheckpointContext } from '../../context/checkpoint';

import { tourSteps } from './tour';

const ExploreBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

const ExploreCarto = styled.section``;
function Explore() {
  const { tourStep, setTourStep } = useContext(GlobalContext);
  const { apiLimits } = useContext(ExploreContext);

  const { currentCheckpoint } = useContext(CheckpointContext);
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
          <Panel
            collapsible
            direction='right'
            initialState={true}
            bodyContent={
              <>
                {
                  currentCheckpoint && currentCheckpoint.analytics
                }
              </>
            }
            data-cy='secondary-panel'
          />
        </ExploreBody>
        {steps && (
          <Tour steps={steps} tourStep={tourStep} setTourStep={setTourStep} />
        )}
      </Inpage>
    </>
  );
}

export default Explore;
