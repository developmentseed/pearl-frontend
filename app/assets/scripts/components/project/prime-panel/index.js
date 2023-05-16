import React from 'react';
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
import PredictTab from './tabs/predict';
import RetrainTab from './tabs/retrain';
import { UploadAoiModal } from './upload-aoi-modal';
import { PrimeButton } from './prime-button';
import { BatchPredictionPanel } from './batch-prediction-panel';
import { ProjectMachineContext } from '../../../fsm/project';

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

const sessionModeSelector = (state) => state.context.sessionMode;

export function PrimePanel() {
  const actorRef = ProjectMachineContext.useActorRef();
  const sessionMode = ProjectMachineContext.useSelector(sessionModeSelector);

  return (
    <>
      <UploadAoiModal />
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
              <TabbedBlock
                activeTab={['predict', 'retrain'].indexOf(sessionMode)}
              >
                <PredictTab
                  name='predict'
                  className='predict-model'
                  tabId='predict-tab-trigger'
                  onTabClick={() =>
                    actorRef.send({
                      type: 'Switch to predict mode',
                      data: { sessionMode: 'predict' },
                    })
                  }
                />
                <RetrainTab
                  name='retrain'
                  className='retrain-model'
                  tabId='retrain-tab-trigger'
                  onTabClick={() =>
                    actorRef.send({
                      type: 'Switch to retrain mode',
                      data: { sessionMode: 'retrain' },
                    })
                  }
                />
              </TabbedBlock>
            </PanelBlockBody>
            <PanelControls>
              <PrimeButton />
              <BatchPredictionPanel />
            </PanelControls>
          </StyledPanelBlock>
        }
      />
    </>
  );
}
