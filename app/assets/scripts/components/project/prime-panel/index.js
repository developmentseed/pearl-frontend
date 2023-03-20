import React, { useState } from 'react';
import styled from 'styled-components';
import { media, glsp } from '@devseed-ui/theme-provider';

import Panel from '../../common/panel';
import { PanelBlock, PanelBlockBody } from '../../common/panel-block';

import TabbedBlock from '../../common/tabbed-block-body';
import Predict from './tabs/predict';

const StyledPanelBlock = styled(PanelBlock)`
  ${media.largeUp`
    width: ${glsp(24)};
  `}
`;

export function PrimePanel() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Panel
        data-cy='primary-panel'
        collapsible
        overrideControl
        revealed={true}
        direction='left'
        initialState={true}
        fitContent
        bodyContent={
          <StyledPanelBlock>
            <PanelBlockBody>
              <TabbedBlock activeTab={activeTab}>
                <Predict
                  name='predict'
                  className='predict-model'
                  tabId='predict-tab-trigger'
                />
              </TabbedBlock>
            </PanelBlockBody>
          </StyledPanelBlock>
        }
      />
    </>
  );
}
