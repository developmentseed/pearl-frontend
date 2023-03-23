import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  media,
  glsp,
  disabled as disabledStyles,
} from '@devseed-ui/theme-provider';

import Panel from '../../common/panel';
import {
  PanelBlock,
  PanelBlockBody,
  PanelBlockFooter,
} from '../../common/panel-block';

import TabbedBlock from '../../common/tabbed-block-body';
import Predict from './tabs/predict';
import InfoButton from '../../common/info-button';
import { ProjectMachineContext } from '../../../context/project-xstate';

const StyledPanelBlock = styled(PanelBlock)`
  ${media.largeUp`
    width: ${glsp(24)};
  `}
`;

const PanelControls = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};

  ${({ disabled }) =>
    disabled &&
    css`
      ${disabledStyles()}
    `}
`;

const selectors = {
  primeButton: (state) => state.context.primeButton,
};

export function PrimePanel() {
  const [activeTab, setActiveTab] = useState(0);

  const actorRef = ProjectMachineContext.useActorRef();
  const primeButton = ProjectMachineContext.useSelector(selectors.primeButton);

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
            <PanelControls>
              <InfoButton
                data-cy='prime-button'
                data-disabled={primeButton.disabled}
                variation='primary-raised-dark'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '1 / -1',
                }}
                onClick={() =>
                  !primeButton.disabled && actorRef.send('Prime button pressed')
                }
                visuallyDisabled={primeButton.disabled}
                id='apply-button-trigger'
              >
                {primeButton.label}
              </InfoButton>
            </PanelControls>
          </StyledPanelBlock>
        }
      />
    </>
  );
}
