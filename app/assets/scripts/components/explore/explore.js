import React, { useContext } from 'react';
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

const ExploreBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

const ExploreCarto = styled.section``;
function Explore() {
  const { tourStep, setTourStep } = useContext(GlobalContext);
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
            bodyContent={<div>Secondary panel</div>}
            data-cy='secondary-panel'
          />
        </ExploreBody>
        <Tour tourStep={tourStep} setTourStep={setTourStep} />
      </Inpage>
    </>
  );
}

export default Explore;
