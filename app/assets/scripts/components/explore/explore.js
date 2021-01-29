import React from 'react';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import Panel from '../common/panel';

function Explore(props) {
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
        <InpageBody>
          <Panel 
            collapsible
            direction='left'
            initialState={true}
            bodyContent ={
              <div>Primary panel</div>
            }

          />
        </InpageBody>
      </Inpage>
    </>
  );
}

export default Explore;
