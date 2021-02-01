import React from 'react';
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

const ExploreBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

const ExploreCarto = styled.section``;

function Explore() {
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
          <Panel
            collapsible
            direction='left'
            initialState={true}
            bodyContent={<div>Primary panel</div>}
          />
          <ExploreCarto />
          <Panel
            collapsible
            direction='right'
            initialState={true}
            bodyContent={<div>Secondar panel</div>}
          />
        </ExploreBody>
      </Inpage>
    </>
  );
}

export default Explore;
