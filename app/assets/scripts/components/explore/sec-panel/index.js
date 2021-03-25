import React from 'react';
import ClassDistribitionChart from './class-distribution-chart';
import styled from 'styled-components';


import Panel from '../../common/panel';
import {
  PanelBlock,
  PanelBlockHeader as BasePanelBlockHeader,
  PanelBlockBody,
  PanelBlockFooter,
} from '../../common/panel-block';


const Body = styled(PanelBlockBody)`
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
`;


const analytics = JSON.parse('[{"counts":3,"f1score":1,"percent":0.0967741935483871},{"counts":3,"f1score":0,"percent":0.0967741935483871},{"counts":3,"f1score":0,"percent":0.0967741935483871},{"counts":3,"f1score":0,"percent":0.0967741935483871},{"counts":3,"f1score":0,"percent":0.0967741935483871},{"counts":3,"f1score":0,"percent":0.0967741935483871},{"counts":2,"f1score":0,"percent":0.06451612903225806},{"counts":3,"f1score":0,"percent":0.0967741935483871},{"counts":2,"f1score":0,"percent":0.06451612903225806},{"counts":6,"f1score":1,"percent":0.1935483870967742}]')

const classes = JSON.parse('{"No Data":{"name":"No Data","color":"#62a092","geometry":{"type":"MultiPoint","coordinates":[]}},"Water":{"name":"Water","color":"#0000FF","geometry":{"type":"MultiPoint","coordinates":[]}},"Emergent Wetlands":{"name":"Emergent Wetlands","color":"#008000","geometry":{"type":"MultiPoint","coordinates":[]}},"Tree Canopy":{"name":"Tree Canopy","color":"#80FF80","geometry":{"type":"MultiPoint","coordinates":[]}},"Shrubland":{"name":"Shrubland","color":"#806060","geometry":{"type":"MultiPoint","coordinates":[]}},"Low Vegetation":{"name":"Low Vegetation","color":"#07c4c5","geometry":{"type":"MultiPoint","coordinates":[]}},"Barren":{"name":"Barren","color":"#027fdc","geometry":{"type":"MultiPoint","coordinates":[]}},"Structure":{"name":"Structure","color":"#f76f73","geometry":{"type":"MultiPoint","coordinates":[]}},"Impervious Surface":{"name":"Impervious Surface","color":"#ffb703","geometry":{"type":"MultiPoint","coordinates":[]}},"Impervious Road":{"name":"Impervious Road","color":"#0218a2","geometry":{"type":"MultiPoint","coordinates":[]}}}')


function SecPanel(props) {
  const { checkpoint } = props;
  return (
    <Panel
      collapsible
      direction='right'
      initialState={true}
      bodyContent={
        <Body>
          {true && (
            <ClassDistribitionChart
              //checkpoint={checkpoint}
              checkpoint={{
                analytics,
                classes
              }}
            />
          )}
              <div>
                Panel
              </div>

        </Body>
      }
      data-cy='secondary-panel'
    />
  );
}
export default SecPanel;
