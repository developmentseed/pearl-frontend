import React, { useState }  from 'react';
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
import MapComponent from '../common/map/map';
import Layer from '../common/map/layer';

const ExploreBody = styled(InpageBody)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
`;

const ExploreCarto = styled.section``;

function Explore() {
  const [s,setS] = useState([
  [45.51, -122.68],
  [37.77, -122.43],
  [34.04, -118.2],
]);
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
            data-cy='primary-panel'
          />
          <ExploreCarto>
            <button onClick={() => setS([[45,-123],[46,-124]])}>but</button>
            <MapComponent>
              <Layer
                name='base-map'
                type='tileLayer'
                source='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?'
                options={{
                  attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }}
              />

              <Layer
                type='polyline'
                source={s}
              />
            </MapComponent>
          </ExploreCarto>
          <Panel
            collapsible
            direction='right'
            initialState={true}
            bodyContent={<div>Secondary panel</div>}
            data-cy='secondary-panel'
          />
        </ExploreBody>
      </Inpage>
    </>
  );
}

export default Explore;
