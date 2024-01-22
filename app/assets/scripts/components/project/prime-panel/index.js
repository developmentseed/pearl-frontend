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
import { SESSION_MODES } from '../../../fsm/project/constants';
import selectors from '../../../fsm/project/selectors';
import * as guards from '../../../fsm/project/guards';

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

// Map session mode to selected tab index
const tabIndexes = {
  [SESSION_MODES.LOADING]: 0,
  [SESSION_MODES.PREDICT]: 0,
  [SESSION_MODES.RETRAIN]: 1,
};

export function PrimePanel() {
  const actorRef = ProjectMachineContext.useActorRef();
  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const isLargeAoi = ProjectMachineContext.useSelector((s) =>
    guards.isLargeAoi(s.context)
  );
  const retrainModeEnabled = ProjectMachineContext.useSelector(({ context }) =>
    guards.retrainModeEnabled(context)
  );

  return (
    <>
      <UploadAoiModal />
      <Panel
        data-cy='primary-panel'
        collapsible
        direction='left'
        initialState={true}
        fitContent
        bodyContent={
          <StyledPanelBlock>
            <PanelBlockBody>
              <TabbedBlock activeTab={tabIndexes[sessionMode]}>
                <PredictTab
                  name='predict'
                  className='predict-model'
                  tabId='predict-tab-trigger'
                  onTabClick={() =>
                    actorRef.send({
                      type: 'Switch to predict mode',
                      data: { sessionMode: SESSION_MODES.PREDICT },
                    })
                  }
                />
                <RetrainTab
                  name='retrain'
                  className='retrain-model'
                  tabId='retrain-tab-trigger'
                  tabTooltip={
                    isLargeAoi
                      ? 'Retrain is not available for large areas'
                      : 'Retrain is not available until model has been run over AOI.'
                  }
                  disabled={!retrainModeEnabled}
                  onTabClick={() =>
                    actorRef.send({
                      type: 'Switch to retrain mode',
                      data: { sessionMode: SESSION_MODES.RETRAIN },
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
